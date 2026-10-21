/* Optional, player-requested practice. No new automatic events or AI actions. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U;
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function sport(l) { return free(l) && l.age >= 6 && l.talent === 'thể thao'; }
  function pro(l) { var s = l.flags.esports; return free(l) && !l.retired && E.ESPORTS.managed(l) && (!s || l.age < s.retire); }
  function ready(l, d, id, valid) { return valid(l) && d && d.at === l.age && l.flags[id] !== l.age; }
  function gain(l, n, log) {
    var before = E.talentLevel(l).lv, old = l.skill || 0;
    l.skill = U.clamp(old + n * (old >= 85 ? 0.35 : old >= 65 ? 0.65 : 1), 0, 100);
    var after = E.talentLevel(l); l.flags.tLv = after.lv;
    log('Kỹ năng ' + (l.talentSub || 'thể thao') + ' ' + Math.round(old) + ' → ' + Math.round(l.skill) + '/100' + (after.lv > before ? ', lên cấp ' + after.lv + ' — ' + after.name : '') + '.', 'good');
  }
  E.SC('vd_training', {
    title: function (l) { return 'Luyện tập ' + (l.talentSub || 'thể thao'); },
    valid: sport,
    prep: function (l) { return { at: l.age, discipline: l.talentSub || '', fee: l.base * 0.025 }; },
    text: function (l) { return 'Bạn muốn dành đợt luyện tập này cho phần nào của ' + (l.talentSub || 'môn thể thao mình yêu thích') + '?'; },
    opts: [
      { k: 'technique', l: 'Luyện kỹ thuật theo giáo án vừa sức', h: 'Không mất phí; tăng kỹ năng, cần thời gian nghỉ sau tập', req: function (l) { return !l.injured && l.st.hea >= 35; }, run: function (l, r, log, d) { if (!ready(l, d, 'sportPracticeAt', sport) || (l.talentSub || '') !== d.discipline) return; l.flags.sportPracticeAt = l.age; gain(l, 3 + r() * 2, log); H.fx(l, { hea: -0.5, hap: 1 }); } },
      { k: 'fitness', l: 'Rèn thể lực và phối hợp động tác', h: 'Không mất phí; tăng sức khỏe và một phần kỹ năng', req: function (l) { return !l.injured && l.st.hea >= 35; }, run: function (l, r, log, d) { if (!ready(l, d, 'sportPracticeAt', sport) || (l.talentSub || '') !== d.discipline) return; l.flags.sportPracticeAt = l.age; gain(l, 2 + r(), log); H.fx(l, { hea: 1.5 }); } },
      { k: 'coach', l: 'Tập cùng huấn luyện viên', h: function (l, d) { return H.money(l, d.fee); }, req: function (l, d) { return l.age >= 18 && l.indep && l.money >= d.fee && !l.injured && l.st.hea >= 35; }, run: function (l, r, log, d) { if (!ready(l, d, 'sportPracticeAt', sport) || (l.talentSub || '') !== d.discipline) return; l.flags.sportPracticeAt = l.age; H.cash(l, -d.fee, 'Tập cùng huấn luyện viên'); gain(l, 5 + r(), log); H.fx(l, { hea: -0.5 }); } },
      { k: 'recovery', l: 'Tập nhẹ, nghỉ và xem lại kỹ thuật', h: 'Không mất phí; hồi sức, không tăng kỹ năng thi đấu', run: function (l, r, log, d) { if (!ready(l, d, 'sportPracticeAt', sport)) return; l.flags.sportPracticeAt = l.age; H.fx(l, { hea: 1, hap: 1 }); log('Bạn giữ buổi tập nhẹ, nghỉ đủ và xem lại kỹ thuật ' + (l.talentSub || 'thể thao') + '.', 'neutral'); } },
      { k: 'close', l: 'Để dịp khác', run: function () {} }
    ]
  });
  E.ACT.push({ id: 'vd_training', g: 'Năng khiếu', l: function (l) { return 'Luyện tập ' + (l.talent === 'thể thao' && l.talentSub || 'thể thao') + ' / nâng kỹ năng'; }, min: 6, avail: function (l) { return sport(l) && l.flags.sportPracticeAt !== l.age ? true : 'Dành cho tài năng thể thao, mỗi năm một đợt tập'; } });
  function esReady(l, d) { return ready(l, d, 'esTrainingAt', pro) && l.flags.esports && l.flags.esports.game === d.game && l.flags.esports.careerKey === d.career; }
  function train(l, d, kind, log) {
    if (!esReady(l, d)) return;
    var s = l.flags.esports; l.flags.esTrainingAt = l.age;
    var reflex = kind === 'reflex' ? 3 : kind === 'tactics' ? 1 : 0, form = kind === 'recovery' ? 8 : kind === 'tactics' ? 4 : 2;
    s.reflex = U.clamp(s.reflex + reflex * (s.reflex >= 85 ? 0.35 : 1), 0, 100); l.skill = s.reflex;
    s.experience = U.clamp(s.experience + (kind === 'tactics' ? 3 : 1), 0, 100);
    s.form = Math.round(U.clamp(s.form + form, 0, 100));
    s.manualTraining = { at: l.age, form: form };
    if (kind === 'recovery') { H.fx(l, { hea: 1 }); if (l.mind) l.mind.stress = U.clamp(l.mind.stress - 4, 0, 100); }
    else H.fx(l, { hea: -0.5 });
    if (E.esportsPractice) E.esportsPractice(l, l.game, false);
    if (l.flags.esPractice && l.flags.esPractice[l.game]) l.flags.esPractice[l.game].skill = s.reflex;
    log((kind === 'reflex' ? 'Luyện phản xạ và thao tác' : kind === 'tactics' ? 'Phân tích replay, luyện chiến thuật' : 'Phục hồi, điều chỉnh lịch ngủ') + ' · phản xạ ' + Math.round(s.reflex) + '/100 · kinh nghiệm ' + Math.round(s.experience) + '/100 · phong độ ' + s.form + '/100.', 'good');
  }
  E.SC('es_training', {
    title: 'Training tuyển thủ esports', valid: pro,
    prep: function (l, r) { var s = E.ESPORTS.init(l, r); return { at: l.age, game: s.game, career: s.careerKey }; },
    text: function (l) { var s = l.flags.esports; return l.game + ' · phản xạ ' + Math.round(s.reflex) + '/100 · kinh nghiệm ' + Math.round(s.experience) + '/100 · phong độ ' + s.form + '/100. Bạn muốn tập trung vào phần nào?'; },
    opts: [
      { k: 'reflex', l: function (l) { return l.flags.esports.game === 'tft' ? 'Luyện thao tác nhanh và chuyển đội hình' : 'Luyện phản xạ và thao tác cá nhân'; }, h: 'Tăng phản xạ; cần nghỉ sau tập', req: function (l) { return !l.injured && l.st.hea >= 35; }, run: function (l, r, log, d) { train(l, d, 'reflex', log); } },
      { k: 'tactics', l: 'Phân tích replay và luyện chiến thuật', h: 'Tăng kinh nghiệm, phong độ và một phần phản xạ', run: function (l, r, log, d) { train(l, d, 'tactics', log); } },
      { k: 'recovery', l: 'Phục hồi phong độ, điều chỉnh lịch nghỉ', h: 'Tăng phong độ, giảm stress; không tăng phản xạ', run: function (l, r, log, d) { train(l, d, 'recovery', log); } },
      { k: 'close', l: 'Để dịp khác', run: function () {} }
    ]
  });
  E.ACT.push({ id: 'es_training', g: 'Công việc', l: 'Training esports: phản xạ / chiến thuật / phong độ', min: 18, avail: function (l) { return pro(l) && l.flags.esTrainingAt !== l.age ? true : 'Dành cho tuyển thủ esports đang thi đấu, mỗi năm một đợt'; } });
  var annual = E.ESPORTS.annual;
  E.ESPORTS.annual = function (l) { var s = l.flags.esports, already = s && s.aged === l.age, result = annual.apply(this, arguments); s = l.flags.esports; if (!already && E.ESPORTS.managed(l) && s && s.manualTraining && s.manualTraining.at === l.age) s.form = Math.round(U.clamp(s.form + s.manualTraining.form, 0, 100)); return result; };
})(globalThis.G);
