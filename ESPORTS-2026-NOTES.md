# Esports V5.6.0 — internal release notes

This document is outside `public/` and is not uploaded with the game. Sources are not displayed in gameplay.

## Reference catalog

The catalog is a dated 2026 reference, not a live transfer service or a prediction of real rosters in later simulation years.

- LoL: LCK 10, LPL 14, LEC 10 plus Los Ratones and Karmine Corp Blue for Versus, LCS 8, CBLOL 8, LCP 8. Starting lineups are taken from the latest match by role in the available Oracle's Elixir CSV, through 10 April 2026. This does **not** claim October-current lineups or every registered substitute.
- VALORANT: 48 International League teams plus 14 teams entering Stage 2 through Challengers/Nationals. The China event has 14 participants; the other three have 16. Lineups are snapshots of a recorded 2026 match, with its match URL preserved in `.local/esports/catalog-audit.json`. Transfer changes can mean the same person appears in two dated snapshots.
- AoV: AOG Winter's 9 teams, Super Nova from Spring, RPL 9, GCS 7, ACS 8. Super Nova is an archived Spring entry and cannot recruit the player. BOOM and RRQ do not enter the Spring qualifier chain. AOG Spring has 8 slots; Winter has 9.
- TFT: the 40 players listed by Riot for Space Gods Tactician's Crown, grouped into AMER, EMEA, APAC and CN. These are individual entries, not five-player teams. This does not claim to list every open-entry TFT competitor worldwide.

## Official format sources

- https://lolesports.com/en-AU/news/season-start-2026-lol-esports
- https://lolesports.com/en-US/news/msi-and-worlds-updates
- https://lolesports.com/en-GB/news/worlds-2026-primer
- https://valorantesports.com/en-US/news/vct-2026-season-start-eyntk
- https://valorantesports.com/en-US/season/115571062868511862/handbook/115571062868708473
- https://teamfighttactics.leagueoflegends.com/en-us/news/esports/compete-space-gods/
- https://teamfighttactics.leagueoflegends.com/en-us/news/esports/s-17-regional-finals-everything-you-need-to-know/
- https://teamfighttactics.leagueoflegends.com/en-us/news/esports/space-gods-tacticians-crown-primer/
- https://www.garena.sg/news/2M54DC

## Roster sources

- https://github.com/twodotone/finalLOL/blob/main/data/csv/2026_LoL_esports_match_data_from_OraclesElixir.csv
- https://www.vlr.gg/ — public team and match pages; collector scripts preserve match links locally.
- https://vsgg.com/en/news/19930 — AOG Winter lineups.
- https://vsgg.com/news/19647 — RPL Winter lineups.
- https://esports.moba.garena.tw/gcs/team — GCS team pages.
- https://liquipedia.net/honorofkings/AOV_Crown_Series/2026
- https://maisesports.com.br/campeonatos/kog-arena-of-glory-spring-2026/escalacoes
- https://liquipedia.net/valorant/VCT/2026/China_League/Stage_2
- https://liquipedia.net/valorant/VCT/2026/Pacific_League/Stage_2
- https://liquipedia.net/valorant/BESTIA

## Money: verified awards vs simulated private contracts

Published **team** awards are never credited entirely to one player. Private salaries and prize-sharing agreements are not public for every organization: annual offer values and personal shares are explicitly simulation parameters, not purported disclosures of named players' pay. The game states the offer's salary/share when it is accepted. The default team player's share is 12%; an independent TFT player keeps 100%, or 80% under a simulated sponsor contract. No universal tax rate is invented.

Salary anchors: LEC full-season 60,000 EUR minimum where applicable; VCT Americas 50,000 USD, EMEA 50,000 EUR, Pacific 67,000,000 KRW. Other league contract values are bounded simulation estimates; there is no verified universal salary for every team. Nominal payouts convert once to internal currency, without applying the general-country wage multiplier.

- https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/cf/LEC_2026_Rulebook.pdf/revision/latest?cb=20260520162555
- https://www.vlr.gg/739117/vct-salaries — quotes the linked 2026 roster-construction rules, page 29.

Prize tables implemented: First Stand, MSI, Worlds, both VALORANT Masters, Champions, LoL/VALORANT EWC, LCP splits, APL, TFT Crown/TPC; confirmed portions of AOG, RPL, GCS, ACS and TFT regional awards. AOG uses per-score bounty budgets plus placement awards. Some rounds are condensed into one decision and standings are simulated, not a full tournament engine.

- https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/96/First_Stand_2026_Rulebook.pdf/revision/latest?cb=20260304225039
- https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/81/MSI_2026_Rulebook.pdf/revision/latest?cb=20260615195447
- https://liquipedia.net/leagueoflegends/World_Championship/2026
- https://liquipedia.net/valorant/VCT/2026/Stage_1/Masters
- https://liquipedia.net/valorant/VCT/2026/Stage_2/Masters
- https://en.wikipedia.org/wiki/2026_Valorant_Champions
- https://ewc-web.prod.esf-systems.com/en/competitions/2026/league-of-legends
- https://ewc-web.prod.esf-systems.com/en/competitions/2026/valorant
- https://liquipedia.net/leagueoflegends/LCP/2026/Split_1
- https://game-tournaments.com/lol/lcp-2026-split-3
- https://www.esportsverse.live/tournaments/honor-of-kings/arena-of-valor-premier-league-2026/prizepool
- https://liquipedia.net/honorofkings/Arena_of_Glory/2026/Spring/Prize_Money
- https://fpt.vn/tin-tuc/dtdv-mua-dong-2026-lich-thi-dau-ket-qua-15510.html
- https://liquipedia.net/honorofkings/RoV_Pro_League/2026/Winter
- https://liquipedia.net/honorofkings/Garena_Challenger_Series/2026/Summer
- https://liquipedia.net/tft/Space_Gods/Tacticians_Crown
- https://liquipedia.net/tft/Space_Gods/TFT_Pro_Circuit/AMER/Stargazer_Cup
- https://liquipedia.net/tft/Space_Gods/AMER/Regional_Finals
- https://liquipedia.net/tft/Space_Gods/EMEA/Regional_Finals

Unconfirmed awards (including AIC 2026) are not fabricated. The UI says the award is not yet fixed; no cash is invented. AoV EWC crossover and TFT EWC team mode are outside this career's implemented calendar. AIC qualification is a condensed simulation; the detailed 2026 format was not verified. No claim of complete replication of all private contracts or every minor circuit should be made.

## Gameplay safeguards

- Team recruitment precedes professional competition. Vietnam LoL starts in youth/VCS B; signing with an LCP organization is recruitment, not an automatic league-slot promotion.
- Most careers retire at 26–29 under this requested game balance. That is an in-game career rule, not a claim about biological lifespan or every real professional.
- Reflex, experience and form are distinct; practice is tracked by game with a yearly gain cap.
- Gaming house removes only the player's basic food/utilities and personal rent. Family housing, children, vehicles, debt, gifts and optional spending remain payable. Benefits cease when employment ends.
- International tournament entry checks results, and payouts are idempotent per event/season. Existing generic esports title/bonus rolls are disabled for the four managed games.
- Dated roster sources are removed from the shipped data; only concise season labels remain in gameplay.
