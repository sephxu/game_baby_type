# 布鲁伊（Bluey）默认词汇库方案

> 目标：把当前 Baby Type! 打字游戏的字母卡内容，替换为以《布鲁伊》(Bluey) 为主题的词汇库，
> 并把架构改造为「可切换的多套词汇库」。本方案给出 ①素材调研结论 ②数据架构 ③A–Z 完整闪卡设计
> ④配图来源映射（现有素材 vs 需生图）⑤生图清单 ⑥代码集成计划。

---

## 1. 素材调研结论

调研目录：`/Volumes/团队文件-Yoo/音频/`

| 子目录 | 内容 | 对本方案的价值 |
|--------|------|----------------|
| `经典041A.../7-第一季词汇表 PDF` | `Bluey Season 1 Glossary.pdf` 全集英文单词字典（含 a/about 等虚词及音标释义） | **选词校验**：确认某单词确实在剧中出现；不直接作为闪卡词源（太杂） |
| `经典041A.../9-...闪卡` | 30 张官方活动闪卡（找词游戏 / 配对，1080² 左右） | 参考排版风格，部分可作彩蛋；非逐字母素材 |
| `经典041A.../9-...壁纸` | **102 张官方角色/场景高清图**（多为 1080×1920 PNG/JPG） | **核心配图来源**：角色、房子、道具一应俱全 |
| `经典041A.../8-绘本 / 11-杂志 PDF` | 绘本、杂志 | 后续可作短句语料补充 |
| `04.国语音频 / 1~4 视频音频` | 三季正片音视频 | 后续可做真人/角色配音，本期不依赖 |

**结论**：壁纸目录是天然的配图金矿。布鲁伊角色名本身覆盖大量字母（B/C/M/S/L/I/R/W/V/J/N…），
直接以「角色 + 道具 + 场景」组织闪卡，既贴合 IP 又能复用现成高清官图，缺口字母再用生图技能补齐。

---

## 2. 数据架构：支持多套词汇库

### 2.1 现状
`index.html` 内 `LETTER_MAP` 硬编码为 `{ emoji, word, color }`，渲染时只显示「emoji + 单词」。

### 2.2 目标结构
引入 `LIBRARIES` 顶层对象，每套库自描述渲染方式（emoji 或 图片），闪卡新增 `phrase`（短句）与 `img`（配图）字段。

```js
// 闪卡 card 结构（统一）
// { word, phrase, color, emoji?, img? }
//   - emoji: 经典库用；布鲁伊库作为图片加载失败时的兜底
//   - img:   相对 library.basePath 的文件名；存在则优先渲染 <img>

const LIBRARIES = {
  classic: {
    id: 'classic',
    name: '经典 Emoji',
    render: 'emoji',
    letters: { a: [ { word:'Apple', emoji:'🍎', color:'#E07070' }, ... ], ... },
    numbers: { ... }            // 复用现有 NUMBER_MAP
  },
  bluey: {
    id: 'bluey',
    name: '布鲁伊 Bluey',
    render: 'image',
    basePath: 'assets/bluey/',
    letters: { a: [ { word:'Adventure', phrase:"Let's go on an adventure!", img:'a-adventure.jpg', emoji:'🏕️', color:'#7FB069' }, ... ], ... },
    numbers: { ... }            // 数字沿用 emoji，可后续换布鲁伊配图
  }
};

let currentLibId = localStorage.getItem('vocabLib') || 'bluey';   // 默认布鲁伊
const lib = () => LIBRARIES[currentLibId];
```

### 2.3 渲染改造要点（index.html）
1. `showLetterCard(key)` 取卡：`randomPick(lib().letters[key])`。
2. 卡片 DOM 增加图片层：库 `render==='image'` 且 `card.img` 存在 → 渲染 `<img src=basePath+img>`；
   失败 `onerror` 回退到 `emoji`。emoji 库维持纯 emoji。
3. 卡片文字：第一行大字母，第二行单词，第三行 `phrase`（小字、可选）。
4. 语音：`speak(letter + ', ' + word)`；若有 `phrase`，停顿后再读短句（沿用 `speakSequence`）。
5. 挑战模式 `challengeData` 同步带上 `img/phrase`，命中后展示同一张卡。
6. 家长面板新增「词汇库」下拉，切换写入 `localStorage('vocabLib')` 并即时刷新当前卡。

### 2.4 资源落地
新建 `assets/bluey/`，把选中的壁纸源文件按 `字母-单词.扩展名` 重命名复制进来（见第 4 节映射表的「目标文件名」），
生图产物也输出到同目录。这样词库 JSON 与文件名解耦于原始中文目录，便于打包/部署。

---

## 3. 闪卡设计原则

- **每字母 2–4 套**，全部以该字母开头；优先「布鲁伊角色/道具/场景」，其次布鲁伊剧情高频词。
- **短句**：3–6 个单词，口语化、贴合剧情、适合 2–4 岁跟读（如 "Bluey loves a big hug!"）。
- **配图**：能用官图绝不生图；缺口字母（多为道具/动作类）用生图技能统一布鲁伊画风补齐。
- **颜色** `color`：取角色主色（Bluey 蓝、Bingo 橘红、Bandit 深蓝等），用于大字母配色。

---

## 4. A–Z 完整闪卡库与配图映射

> 来源列：`壁纸/<文件名>` = 现有官图可直接复用；`【生图】` = 需用 zenmux 生图技能生成。
> 目标文件名统一存到 `assets/bluey/`。

| 字母 | 单词 | 短句 | 配图来源 | 目标文件名 |
|---|---|---|---|---|
| A | Adventure | Let's go on a big adventure! | 壁纸/Camping-Tree.jpg | a-adventure.jpg |
| A | Aeroplane | Dad is a flying aeroplane! | 【生图】Bandit 扛 Bluey 当飞机 | a-aeroplane.png |
| B | Bluey | Bluey is a Blue Heeler pup. | 壁纸/Bluey.png | b-bluey.png |
| B | Bingo | Bingo is Bluey's little sister. | 壁纸/Bingo-Hearts.png | b-bingo.png |
| B | Bandit | Bandit is Bluey's dad. | 壁纸/Bandit.jpg | b-bandit.png |
| B | Balloon | Keepy uppy with the balloon! | 【生图】Bluey 顶气球 | b-balloon.png |
| C | Chilli | Chilli is Bluey's mum. | 壁纸/Chilli.jpg | c-chilli.png |
| C | Car | Hop in the car! | 壁纸/Car.png | c-car.png |
| C | Cubby | Play in the cubby house. | 壁纸/Cubby-1.png | c-cubby.png |
| C | Cricket | Time to play cricket! | 壁纸/Cricket.png | c-cricket.png |
| D | Dad | Bandit is the best dad. | 壁纸/Bandit-Chilli-Ballet.png | d-dad.png |
| D | Dragon | Roar! A friendly dragon. | 壁纸/Dragon.png | d-dragon.png |
| D | Dance | Dance mode, activated! | 【生图】Bluey & Bingo 跳舞 | d-dance.png |
| E | Egg | Look at the colorful eggs! | 【生图】布鲁伊主题彩蛋 | e-egg.png |
| E | Elephant | A big gray elephant. | 【生图】布鲁伊画风大象玩偶 | e-elephant.png |
| F | Family | The Heeler family! | 壁纸/HeelerFamV2.jpg | f-family.png |
| F | Featherwand | Mum's magic featherwand! | 壁纸/Featherwand.png | f-featherwand.png |
| F | Floppy | Floppy the bunny. | 【生图】Bingo 抱兔子 Floppy | f-floppy.png |
| G | Grannies | Janet and Rita, the grannies! | 壁纸/Grannies-2-768x1365.jpg | g-grannies.png |
| G | Game | Let's play a fun game! | 【生图】一家人玩游戏 | g-game.png |
| H | House | The Heeler house. | 壁纸/Heeler-House.jpg | h-house.png |
| H | Hug | Big family hug! | 壁纸/Hug.png | h-hug.png |
| H | Hallway | Run down the hallway. | 壁纸/Hallway.png | h-hallway.png |
| I | Indy | Indy is Bluey's friend. | 壁纸/Indy-Wallpaper-scaled.jpg | i-indy.png |
| I | Ice cream | Yummy ice cream! | 【生图】Bluey 吃冰淇淋 | i-icecream.png |
| J | Jean-Luc | Jean-Luc from camping. | 壁纸/Camping-JeanLuc.jpg | j-jeanluc.png |
| J | Jump | Jump up so high! | 【生图】Bluey 跳跃 | j-jump.png |
| K | Keepy Uppy | Don't let it touch the ground! | 【生图】顶气球游戏 | k-keepyuppy.png |
| K | Kite | Fly the kite up high! | 【生图】Bluey 放风筝 | k-kite.png |
| L | Lucky | Lucky lives next door. | 壁纸/Lucky-Wallpaper-scaled.jpg | l-lucky.png |
| L | Leaf | A floating green leaf. | 【生图】布鲁伊画风树叶 | l-leaf.png |
| M | Mum | Chilli is a great mum. | 壁纸/Chilli-Bluey.png | m-mum.png |
| M | Muffin | Muffin is the cousin. | 壁纸/Muffin.png | m-muffin.png |
| M | Mackenzie | Mackenzie at school. | 壁纸/Mackenzie-Wallpaper-scaled.jpg | m-mackenzie.png |
| N | Nana | Nana loves the kids. | 壁纸/Nana.jpg | n-nana.png |
| N | Night | Sleepytime, good night. | 【生图】夜晚睡觉场景 | n-night.png |
| O | Outside | Let's play outside! | 壁纸/Camping-Tree.jpg | o-outside.jpg |
| O | Orange | A round orange fruit. | 【生图】布鲁伊画风橙子 | o-orange.png |
| P | Polly | Polly the doll. | 壁纸/Bluey-Polly.png | p-polly.png |
| P | Pirates | Ahoy there, pirates! | 壁纸/Pirates.png | p-pirates.png |
| P | Pool | Splash in the pool! | 【生图】泳池戏水 | p-pool.png |
| Q | Queen | Bluey is the queen! | 【生图】Bluey 戴皇冠 | q-queen.png |
| Q | Quiet | Shhh, be quiet. | 【生图】Bluey 嘘手势 | q-quiet.png |
| R | Rusty | Rusty is a good friend. | 壁纸/Rusty.jpg | r-rusty.png |
| R | Rainbow | A big bright rainbow! | 【生图】布鲁伊画风彩虹 | r-rainbow.png |
| S | Socks | Socks is the little cousin. | 壁纸/Socks-1.jpg | s-socks.png |
| S | Sisters | Bluey and Bingo, sisters! | 壁纸/Sisters.png | s-sisters.png |
| S | Slide | Down the slide, wheee! | 壁纸/Slide.png | s-slide.png |
| S | Stripe | Uncle Stripe is here. | 壁纸/Stripe.jpg | s-stripe.png |
| T | Tablet | Bingo's tablet. | 壁纸/Tablet-1.png | t-tablet.png |
| T | Trixie | Aunt Trixie. | 壁纸/Trixue.jpg | t-trixie.png |
| T | Tickle | Tickle crabs are coming! | 【生图】挠痒游戏 | t-tickle.png |
| U | Unicorse | Unicorse, the grumpy toy! | 【生图】Unicorse 玩偶 | u-unicorse.png |
| U | Umbrella | Under the umbrella. | 【生图】布鲁伊画风雨伞 | u-umbrella.png |
| V | Val | Grumpy old Nana Val. | 壁纸/Val-3-1024x576.png | v-val.png |
| W | Winton | Winton is at school. | 壁纸/Winton.jpg | w-winton.png |
| W | Water | Play in the water! | 壁纸/Beach-Family-2.jpg | w-water.jpg |
| X | Xylophone | The magic xylophone! | 【生图】Bandit 弹木琴定身 | x-xylophone.png |
| Y | Yawn | Big yawn, time for bed. | 【生图】Bluey 打哈欠 | y-yawn.png |
| Y | Yellow | Yellow like the sun. | 【生图】布鲁伊画风太阳 | y-yellow.png |
| Z | Zoo | A fun day at the zoo! | 【生图】一家人逛动物园 | z-zoo.png |
| Z | Zoom | Zoom, zoom in the car! | 壁纸/Car.png | z-zoom.png |

**统计**：约 62 张闪卡。其中 **现成官图直接复用 ≈ 37 张**，**需生图 ≈ 25 张**。
每个字母均 ≥1 套（含 Q/U/X/Y/Z 等冷门字母）。

---

## 5. 生图清单（zenmux-image-generation 技能）

为保证整套画风统一，生图统一遵循风格提示词（Style Prompt）：

> "Official Bluey TV show art style, flat 2D cartoon, thick clean outlines, soft pastel
> Australian palette, simple background, square composition, child-friendly, high quality."

需生成的 25 张（按字母）：a-aeroplane, b-balloon, d-dance, e-egg, e-elephant, f-floppy,
g-game, i-icecream, j-jump, k-keepyuppy, k-kite, l-leaf, n-night, o-orange, p-pool,
q-queen, q-quiet, r-rainbow, t-tickle, u-unicorse, u-umbrella, x-xylophone, y-yawn,
y-yellow, z-zoo。

> 版权说明：素材源为官方布鲁伊图，生图为「同人风格」用于本地自用学习游戏。若需公开发布，
> 建议改用原创吉祥物或获授权，避免版权风险。

---

## 6. 代码集成计划（index.html）

1. **抽出数据**：`LETTER_MAP`→`LIBRARIES.classic.letters`；新增 `LIBRARIES.bluey.letters`（上表数据）。
2. **当前库变量**：`currentLibId`，默认 `'bluey'`，读写 `localStorage`。
3. **卡片渲染**：`#letter-card` 内增加 `#card-image`(img) 与 `#card-phrase`(div)；
   `render==='image'` 且有 `img` 时显示图片并隐藏大 emoji，否则走原 emoji 路径。
4. **图片兜底**：`<img onerror>` → 回退 emoji，保证缺图不崩。
5. **语音**：单词 + 短句顺序朗读（沿用 `speakSequence`）。
6. **家长面板**：加「词汇库」下拉（经典 Emoji / 布鲁伊）。
7. **挑战模式**：`challengeData` 透传 `img/phrase`。
8. **预加载**：首次进入预加载当前库图片，避免首翻卡闪烁。

> 单文件架构不变（零依赖），仅 `assets/bluey/` 为新增静态资源目录。

---

## 7. 落地步骤建议（执行顺序）

1. 建 `assets/bluey/`，复制 37 张现有官图并按目标文件名重命名。
2. 用生图技能批量生成 25 张缺口图，输出到同目录。
3. 改造 `index.html`：多库架构 + 图片渲染 + 短句 + 面板切换。
4. 本地浏览器自测：A–Z 逐键、挑战模式、库切换、缺图兜底。
5. 提交（按 CLAUDE.md：功能/资源/改造分多次 commit）。
