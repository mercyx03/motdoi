/* v8.9.5 — Dịch vụ ngầm: Thuê sát thủ và đặc nhiệm bí mật.
   Các nhiệm vụ: theo dõi tình trạng, quấy rối/đe dọa, hạ sát (kill).
   Đối tượng: kẻ thù/mâu thuẫn, người trong gia đình, người lạ, người có sức ảnh hưởng.
   Cam kết bảo mật theo mức thù lao: thù lao thấp dễ bị khai ra; thù lao cao giữ im lặng;
   mức tối thượng tự sát (44) để bịt đầu mối theo hợp đồng tài chính đã ký. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, N = E.ELITE148;
  function free(l) {
    return l && l.alive && l.age >= 18 && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military);
  }
  function state(l) {
    var s = l.flags.hitman176 || (l.flags.hitman176 = {});
    if (!Array.isArray(s.contracts)) s.contracts = [];
    if (!s.tracked || typeof s.tracked !== 'object') s.tracked = {};
    return s;
  }
  function underworld(l) {
    return l.flags.underworld || (l.flags.underworld = { linked: false, heat: 0, hunted: false });
  }
  function addHeat(l, n) {
    var uw = underworld(l);
    uw.heat = U.clamp((uw.heat || 0) + n, 0, 100);
  }

  // Quy đổi giá trị tương đương USD (ví dụ 100k, 500k, 1M, 5M USD)
  // Nếu tiền tệ là USD thì lấy trực tiếp, nếu là VND thì tỷ giá tương đương 25.000 đ / USD
  function usdAmount(l, usd) {
    if (l.cur === 'usd') return usd;
    return usd * 25000;
  }

  var TIERS = [
    { id: 'amateur', n: 'Giang hồ mạng / Nghiệp dư', usd: 100000, labelUsd: '100k USD', winRate: 0.65, leakRate: 0.85, desc: 'Dễ bị lộ; nếu bị cảnh sát bắt sẽ khai ra bạn ngay để giảm án' },
    { id: 'pro', n: 'Sát thủ chuyên nghiệp', usd: 500000, labelUsd: '500k USD', winRate: 0.82, leakRate: 0.0, desc: 'Có hợp đồng ngầm; nếu bị bắt sẽ giữ im lặng, tự nhận hết tội một mình' },
    { id: 'elite', n: 'Đội ngũ ngầm quốc tế', usd: 1000000, labelUsd: '1 triệu USD', winRate: 0.90, leakRate: 0.0, desc: 'Kỹ thuật cao, xóa sạch dữ liệu; nếu bị bắt không bao giờ hé lộ danh tính chủ mưu' },
    { id: 'deadly', n: 'Tử sĩ bịt đầu mối (Hợp đồng 44)', usd: 5000000, labelUsd: '5 triệu USD', winRate: 0.96, leakRate: 0.0, suicide: true, desc: 'Thỏa thuận nuôi gia đình trọn đời; nếu bị vây bắt sẽ tự sát (44) để bịt sạch đầu mối' }
  ];

  var TASKS = {
    track: { id: 'track', n: 'Theo dõi tình trạng', mood: -5, karma: -8, heat: 5, desc: 'Bí mật bám sát thu thập tin tức, tài sản, sức khỏe và hành tung mục tiêu' },
    harass: { id: 'harass', n: 'Quấy rối & đe dọa', mood: -10, karma: -18, heat: 15, desc: 'Phá rối, khủng bố tinh thần, làm mục tiêu hoảng loạn, sợ hãi hoặc suy sụp' },
    kill: { id: 'kill', n: 'Hạ sát (Kill)', mood: -25, karma: -40, heat: 35, desc: 'Thủ tiêu vĩnh viễn mục tiêu, xóa sổ khỏi cuộc đời' }
  };

  // Thu thập danh sách mục tiêu hợp lệ
  function targetList(l) {
    var list = [];
    // 1. Người trong gia đình
    if (l.partner && l.partner.alive !== false) {
      list.push({ id: 'partner', name: l.partner.name + ' (Vợ/Chồng, ' + (l.partner.age || '') + ' tuổi)', type: 'family', ref: l.partner, rel: 'partner' });
    }
    if (l.fam) {
      if (l.fam.mAlive && !l.fam.noMom) list.push({ id: 'mom', name: 'Mẹ ruột', type: 'family', rel: 'mom' });
      if (l.fam.fAlive && !l.fam.noDad) list.push({ id: 'dad', name: 'Bố ruột', type: 'family', rel: 'dad' });
    }
    (l.kids || []).forEach(function (k, idx) {
      if (k.alive !== false) list.push({ id: 'kid:' + idx, name: (k.name || k.n) + ' (Con, ' + (l.age - k.born) + ' tuổi)', type: 'family', ref: k, rel: 'kid' });
    });
    (l.sibList || []).forEach(function (s, idx) {
      if (s.alive !== false) list.push({ id: 'sib:' + idx, name: (s.n || s.name) + ' (Anh/Chị/Em)', type: 'family', ref: s, rel: 'sib' });
    });

    // 2. Kẻ thù / Người mâu thuẫn
    if (E.CAREER109 && E.CAREER109.conflicts) {
      E.CAREER109.conflicts(l).forEach(function (p) {
        if (p && p.s) list.push({ id: 'conflict:' + p.s.uid, name: (p.name || 'Người mâu thuẫn') + ' (Bất đồng gay gắt)', type: 'enemy', ref: p });
      });
    }
    if (N && N.contacts) {
      N.contacts(l, function (p) { return p.trust < 30 || p.tension > 60; }).slice(0, 5).forEach(function (p) {
        list.push({ id: 'elite_enemy:' + p.uid110, name: p.name + ' (' + (p.job || 'Kẻ thù trong quan hệ') + ')', type: 'enemy', ref: p });
      });
    }

    // 3. Người có sức ảnh hưởng khác (Người nổi tiếng, đối thủ showbiz, tài phiệt)
    if (N && N.contacts) {
      N.contacts(l, function (p) { return p.celeb || p.tier >= 3; }).slice(0, 6).forEach(function (p) {
        list.push({ id: 'celeb:' + p.uid110, name: p.name + ' (' + (p.job || 'Người có sức ảnh hưởng') + ')', type: 'influence', ref: p });
      });
    }

    // 4. Bạn bè / Bạn thân / Người quen
    if (l.bff && l.bff.alive !== false) {
      list.push({ id: 'bff', name: (l.bff.name || l.bff.n) + ' (Bạn thân nhất)', type: 'social', ref: l.bff });
    }
    (l.friends || []).filter(function (f) { return f.alive !== false; }).slice(0, 4).forEach(function (f, idx) {
      list.push({ id: 'friend:' + idx, name: (f.name || f.n) + ' (Bạn bè)', type: 'social', ref: f });
    });

    // 5. Kẻ lạ mặt / Người lạ gây ân oán (sinh ngẫu nhiên nếu cần)
    var seedRng = U.rand(l);
    var strName = H.stranger(l, function () { return seedRng; });
    list.push({ id: 'stranger_biz', name: strName + ' (Đối thủ ngầm / Kẻ lạ mặt gây chuyện)', type: 'stranger', strangerName: strName });

    return list;
  }

  function getTarget(l, id) {
    return targetList(l).find(function (x) { return x.id === id; });
  }

  // Thực thi loại bỏ mục tiêu khi hạ sát
  function killTarget(l, target, log) {
    if (target.rel === 'partner') {
      l.partner.alive = false;
      l.partner.deathAge = l.partner.age;
      l.partner.deathCause = 'tử vong bất thường';
      log('Vợ/chồng của bạn đã qua đời bất thường trong một sự việc không rõ nguyên nhân.', 'bad');
    } else if (target.rel === 'mom') {
      l.fam.mAlive = false;
      log('Mẹ của bạn được phát hiện qua đời đột ngột.', 'bad');
    } else if (target.rel === 'dad') {
      l.fam.fAlive = false;
      log('Bố của bạn được phát hiện qua đời đột ngột.', 'bad');
    } else if (target.rel === 'kid' && target.ref) {
      target.ref.alive = false;
      target.ref.death = { age: l.age - target.ref.born, cause: 'tai nạn đáng ngờ' };
      log('Con của bạn (' + target.ref.name + ') đã mất mạng trong một tai nạn đáng ngờ.', 'bad');
    } else if (target.rel === 'sib' && target.ref) {
      target.ref.alive = false;
      log('Anh/chị/em (' + target.ref.name + ') đã qua đời bất thường.', 'bad');
    } else if (target.ref) {
      target.ref.alive = false;
      log(target.name + ' đã bị hạ sát. Báo chí và dư luận chấn động về vụ việc.', 'bad');
    } else {
      log('Mục tiêu (' + target.name + ') đã bị thủ tiêu hoàn toàn.', 'bad');
    }
  }

  // Thực hiện hợp đồng
  function executeContract(l, r, log, targetId, taskId, tierId) {
    var target = getTarget(l, targetId);
    if (!target) {
      log('Mục tiêu không còn tồn tại hoặc đã rời khỏi tầm ngắm.', 'neutral');
      return false;
    }
    var task = TASKS[taskId];
    var tier = TIERS.find(function (t) { return t.id === tierId; });
    if (!task || !tier) return false;

    var cost = usdAmount(l, tier.usd);
    if (l.money < cost) {
      log('Không đủ tiền mặt để ký hợp đồng sát thủ này.', 'neutral');
      return false;
    }

    // Trừ tiền
    H.cash(l, -cost, 'Hợp đồng ngầm: ' + task.n + ' (' + tier.n + ')');
    H.fx(l, { karma: task.karma, hap: task.mood });
    addHeat(l, task.heat);

    var s = state(l);
    var roll = r();
    var success = roll < tier.winRate;

    var contractRec = {
      year: l.birthYear + l.age,
      age: l.age,
      target: target.name,
      task: task.n,
      tier: tier.n,
      cost: cost,
      success: success
    };
    s.contracts.unshift(contractRec);
    if (s.contracts.length > 25) s.contracts.pop();

    if (success) {
      // Thành công
      if (taskId === 'track') {
        s.tracked[targetId] = {
          name: target.name,
          age: l.age,
          health: Math.round(50 + r() * 40),
          wealth: target.type === 'family' ? 'Biết rõ nguồn tiền' : target.type === 'influence' ? 'Tài sản khổng lồ' : 'Trung bình',
          routine: 'Thường xuyên di chuyển và có lịch trình cụ thể',
          reportedAt: l.age
        };
        log('Sát thủ hoàn thành theo dõi ' + target.name + '. Toàn bộ hồ sơ thói quen, tài sản và lịch trình đã được bí mật chuyển tới bạn.', 'good');
      } else if (taskId === 'harass') {
        log('Sát thủ đã tiến hành quấy rối, cảnh cáo và khủng bố tinh thần ' + target.name + '. Mục tiêu rơi vào tình trạng hoảng loạn, lo sợ tột cùng.', 'bad');
        if (target.ref && target.ref.tension) target.ref.tension = Math.max(0, target.ref.tension - 40);
      } else if (taskId === 'kill') {
        killTarget(l, target, log);
        H.mem(l, 'Hợp đồng định mệnh nhắm vào ' + target.name + ' đã hoàn tất.', 5);
      }
      return true;
    }

    // Thất bại hoặc bị lực lượng chức năng phát hiện
    log('Nhiệm vụ nhắm vào ' + target.name + ' bị đổ bể! Cảnh sát và lực lượng an ninh lập tức phong tỏa hiện trường và bắt giữ kẻ ra tay.', 'bad');

    if (tier.id === 'amateur') {
      // Gói nghiệp dư: Sát thủ lập tức khai tên chủ mưu
      log('Tại cơ quan điều tra, tay sát thủ nghiệp dư nhanh chóng suy sụp và khai báo toàn bộ thỏa thuận, chỉ đích danh bạn là kẻ đứng sau trả tiền!', 'bad');
      var jailYears = U.randint(r, 15, 20);
      H.jail(l, jailYears, 'chủ mưu thuê sát thủ ' + task.n.toLowerCase(), log);
      return false;
    }

    if (tier.suicide) {
      // Gói 5M USD: Tự sát 44 để bịt đầu mối theo hợp đồng
      log('Theo thỏa thuận tiền tệ 5 triệu USD đã ký để bảo bọc gia đình, ngay khi bị cảnh sát bao vây, sát thủ đã cắn thuốc độc tự sát (44) để triệt để bịt đầu mối! Cảnh sát không tìm thấy bất kỳ manh mối nào dẫn tới bạn.', 'good');
      H.mem(l, 'Vụ án bí ẩn được khép lại sau khi sát thủ tự vẫn để bịt đầu mối.', 4);
      return true;
    }

    // Gói chuyên nghiệp / quốc tế (500k - 1M USD): Sát thủ giữ im lặng, tự nhận hết tội
    log('Trước sự thẩm vấn gắt gao của cảnh sát, sát thủ chuyên nghiệp giữ đúng quy tắc danh dự thế giới ngầm, tự nhận hết mọi tội danh vì tư thù cá nhân và kiên quyết không khai tên bạn.', 'neutral');
    addHeat(l, 25);
    return true;
  }

  // Xây dựng Menu UPDATE110
  X.menu('hitman176', 'Thuê sát thủ & dịch vụ ngầm', free,
    function (l) {
      var s = state(l), uw = underworld(l);
      var text = 'Dịch vụ thế giới ngầm cung cấp nhân sự bí mật giải quyết các mối đe dọa hoặc triệt tiêu đối tượng.\n' +
                 'Mức thù lao càng cao thì tay nghề càng vững và mức độ cam kết giữ bí mật càng chặt chẽ.\n' +
                 'Độ nguy hiểm ngầm (Heat): ' + uw.heat + '/100. Tiền mặt hiện có: ' + H.money(l, l.money) + '.';
      if (s.contracts.length) {
        text += '\n\nHợp đồng gần nhất: ' + s.contracts[0].task + ' nhắm vào ' + s.contracts[0].target + ' (' + (s.contracts[0].success ? 'Thành công' : 'Thất bại') + ').';
      }
      return text;
    },
    function (l) {
      var targets = targetList(l);
      return targets.map(function (t) {
        return {
          k: 'target:' + t.id,
          l: 'Mục tiêu: ' + t.name,
          h: 'Chọn mục tiêu này để giao nhiệm vụ',
          run: function (l, r) {
            X.next(l, 'hitmanTask176', r, { targetId: t.id });
          }
        };
      });
    }, 18, 'Đường tối');

  X.menu('hitmanTask176', 'Chọn loại nhiệm vụ ngầm', free,
    function (l, d) {
      var target = getTarget(l, d.arg && d.arg.targetId);
      return 'Mục tiêu được chọn: ' + (target ? target.name : 'Chưa rõ') + '.\nHãy chọn hành động mà bạn muốn người thi hành thực hiện:';
    },
    function (l, arg) {
      return Object.keys(TASKS).map(function (k) {
        var task = TASKS[k];
        return {
          k: task.id,
          l: task.n,
          h: task.desc,
          run: function (l, r) {
            X.next(l, 'hitmanTier176', r, { targetId: arg.targetId, taskId: task.id });
          }
        };
      });
    });

  X.menu('hitmanTier176', 'Thỏa thuận thù lao & Điều khoản bảo mật', free,
    function (l, d) {
      var target = getTarget(l, d.arg && d.arg.targetId);
      var task = TASKS[d.arg && d.arg.taskId];
      return 'Mục tiêu: ' + (target ? target.name : '') + ' · Nhiệm vụ: ' + (task ? task.n : '') + '.\n' +
             'Thù lao càng cao, sát thủ càng trung thành và có thỏa thuận bảo mật tuyệt đối. Nếu bị cảnh sát vây bắt, gói tối thượng (5 triệu USD) sẽ tự sát (44) để bịt sạch đầu mối theo hợp đồng tài chính đã ký.';
    },
    function (l, arg) {
      return TIERS.map(function (t) {
        var cost = usdAmount(l, t.usd);
        var canAfford = l.money >= cost;
        return {
          k: t.id,
          l: t.n + ' · ' + H.money(l, cost) + ' (' + t.labelUsd + ')',
          h: t.desc + ' · Tỉ lệ thành công ' + Math.round(t.winRate * 100) + '%',
          why: canAfford ? true : 'Không đủ tiền mặt (Cần ' + H.money(l, cost) + ')',
          run: function (l, r, log) {
            executeContract(l, r, log, arg.targetId, arg.taskId, t.id);
          }
        };
      });
    });

  E.HITMAN176 = {
    state: state,
    targetList: targetList,
    executeContract: executeContract,
    TIERS: TIERS,
    TASKS: TASKS
  };
})(globalThis.G);
