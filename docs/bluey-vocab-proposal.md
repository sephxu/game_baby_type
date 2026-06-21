# 布鲁伊词汇库方案（Bluey Vocab Library）

## 1. 目标

- 使用布鲁伊（Bluey）官方词汇表作为当前打字游戏的**默认词汇库**。
- 数据结构支持**多套词汇库**切换（后续可加 Peppa、emoji 等）。
- 以**闪卡**为单位：每张卡 = `{ 字母, 单词, 短句, 配图, 颜色 }`。
- 每个字母配置**多张**以该字母开头的单词闪卡。
- 配图优先复用 `音频/经典041A.../9-...手工包+闪卡+涂色卡+壁纸` 目录下素材；缺失的用生图技能生成布鲁伊主题图。

## 2. 词汇来源

- 文件：`Bluey Season 1 Glossary.pdf`（第一季 1~52 集词汇表，A-Z 分组，2256 词）。
- 已提取至 `/tmp/bluey_words.json`，每字母词量：A92 B191 C188 D108 E69 F116 G79 H114 I45 J22 K31 L72 M132 N54 O46 P152 Q7 R96 S291 T159 U33 V19 W114 X2 Y21 Z3。

## 3. 闪卡数据结构

```js
// 多库架构
const VOCAB_LIBRARIES = {
  bluey: {
    name: 'Bluey',
    cards: {
      a: [
        { word: 'Apple',  sentence: 'Bluey eats a red apple.',  image: 'bluey/apple.png',  emoji: '🍎', color: '#E07070' },
        ...
      ],
      ...
    }
  },
  emoji: { /* 原 LETTER_MAP 作为兜底库 */ }
};
let currentLibrary = 'bluey';
```

- `image`：`assets/<库>/<文件>`；为空时回退到 `emoji`。
- 渲染：有 `image` 显示 `<img>`，否则显示 emoji；单词、短句始终显示。
- 挑战模式「Find this」提示图也用该卡片的 `image`/`emoji`，命中后展示同一张卡，保证一致。

## 4. 精选词库（A-Z，每字母 4 张，源自词汇表）

配图来源标记：`[asset]` 复用现有素材（文件名见下）、`[gen]` 需生图、`[emoji]` 暂用 emoji 兜底。

| 字母 | 单词 | 短句 | 配图 |
|---|---|---|---|
| A | Apple | Bluey eats a red apple. | gen 🍎 |
| A | Ape | An ape swings on a tree. | gen 🦧 |
| A | Arm | Bandit waves his arm. | gen 💪 |
| A | Angel | Bingo is a little angel. | gen 👼 |
| B | Bluey | This is Bluey the pup. | asset Bluey.png 🐶 |
| B | Bingo | Bingo is Bluey's sister. | asset Bingo.png 🐶 |
| B | Ball | Bluey kicks the ball. | gen ⚽ |
| B | Banana | Bingo loves a banana. | gen 🍌 |
| C | Chilli | Chilli is the mum. | asset Chilli.png 🐶 |
| C | Coco | Coco is a pink poodle. | asset (涂色卡 Coco) 🐩 |
| C | Cat | A cat says meow. | gen 🐱 |
| C | Cake | A yummy birthday cake. | gen 🎂 |
| D | Dad | Dad is Bandit. | asset Dad.png / 涂色卡 Dad 🐶 |
| D | Dog | A dog says woof. | gen 🐶 |
| D | Duck | A duck says quack. | gen 🦆 |
| D | Dinosaur | A big dinosaur. | gen 🦕 |
| E | Elephant | A big elephant. | gen 🐘 |
| E | Egg | A little egg. | gen 🥚 |
| E | Ear | We hear with our ears. | gen 👂 |
| E | Emu | An emu runs fast. | gen 🦤 |
| F | Fruitbat | Bluey is a fruitbat. | asset Fruitbat1.jpg 🦇 |
| F | Family | The Heeler family. | asset Family-1.jpg 👨‍👩‍👧‍👦 |
| F | Frog | A green frog. | gen 🐸 |
| F | Flower | A pretty flower. | gen 🌸 |
| G | Grannies | The grannies dance. | asset Grannies-2-768x1365.jpg 👵 |
| G | Giraffe | A tall giraffe. | gen 🦒 |
| G | Goat | A goat says maa. | gen 🐐 |
| G | Gift | A birthday gift. | gen 🎁 |
| H | Honey | Honey is a friend. | asset Honey (涂色) 🐶 |
| H | House | The Heeler house. | asset Home.jpg / Heeler-House 🏠 |
| H | Horse | A horse says neigh. | gen 🐴 |
| H | Heart | A big red heart. | gen ❤️ |
| I | Indy | Indy is a friend. | asset Indy-Wallpaper-scaled.jpg / 涂色卡 Indy 🐶 |
| I | Ice | Ice is cold. | gen 🧊 |
| I | Iguana | A green iguana. | gen 🦎 |
| I | Insect | A tiny insect. | gen 🐛 |
| J | Judo | Judo is a friend. | gen 🐶 |
| J | Juice | A glass of juice. | gen 🧃 |
| J | Jump | Bluey can jump. | gen 🤸 |
| J | Jellyfish | A jellyfish in the sea. | gen 🪼 |
| K | Kangaroo | A kangaroo hops. | gen 🦘 |
| K | Kitten | A little kitten. | gen 🐱 |
| K | Key | A shiny key. | gen 🔑 |
| K | Kite | A kite in the sky. | gen 🪁 |
| L | Lucky | Lucky is a friend. | asset Lucky-Wallpaper-scaled.jpg / 涂色卡 Lucky 🐶 |
| L | Leaf | A green leaf. | gen 🍃 |
| L | Lion | A lion roars. | gen 🦁 |
| L | Lemon | A sour lemon. | gen 🍋 |
| M | Muffin | Muffin is a cousin. | asset Muffin.png / 涂色卡 Muffin 🐶 |
| M | Mackenzie | Mackenzie is a friend. | asset Mackenzie-Wallpaper-scaled.jpg 🐶 |
| M | Moon | The moon at night. | gen 🌙 |
| M | Monkey | A monkey climbs. | gen 🐵 |
| N | Nest | A bird's nest. | gen 🪺 |
| N | Nose | We smell with our nose. | gen 👃 |
| N | Net | A fishing net. | gen 🥅 |
| N | Nanna | Nanna is grand. | gen 👵 |
| O | Octopus | An octopus has eight arms. | gen 🐙 |
| O | Orange | An orange fruit. | gen 🍊 |
| O | Owl | An owl says hoo. | gen 🦉 |
| O | Ocean | The big blue ocean. | gen 🌊 |
| P | Pirates | Bluey plays pirates. | asset Pirates.jpg 🏴‍☠️ |
| P | Penguin | A little penguin. | gen 🐧 |
| P | Peach | A sweet peach. | gen 🍑 |
| P | Pelican | A pelican by the sea. | gen 🐦 |
| Q | Queen | A queen has a crown. | gen 👑 |
| Q | Quiet | Be quiet, please. | emoji 🤫 |
| Q | Quick | Be quick! | emoji ⚡ |
| R | Rusty | Rusty is a friend. | asset Rusty (涂色卡) 🐶 |
| R | Rabbit | A rabbit hops. | gen 🐰 |
| R | Rainbow | A colorful rainbow. | gen 🌈 |
| R | Rocket | A rocket to the moon. | gen 🚀 |
| S | Socks | Socks is a puppy. | asset Socks-1.jpg 🐶 |
| S | Snickers | Snickers is a friend. | asset Snickers-wallpaper-scaled.jpg 🐶 |
| S | Sun | The sun is bright. | gen ☀️ |
| S | Star | A star in the sky. | gen ⭐ |
| T | Trolley | Bluey rides a trolley. | asset Trolley-combined (涂色) 🛒 |
| T | Typewriter | A clicky typewriter. | asset Typewriter-Friends (涂色) ⌨️ |
| T | Tiger | A tiger has stripes. | gen 🐯 |
| T | Tree | A big green tree. | gen 🌳 |
| U | Unicorn | A magical unicorn. | gen 🦄 |
| U | Uncle | Uncle Stripe visits. | asset Uncle-Stripe (涂色) / emoji 🧑 |
| U | Up | Look up high! | emoji ⬆️ |
| V | Vacuum | The vacuum is loud. | gen 🧹 |
| V | Vase | A vase of flowers. | gen 🏺 |
| V | Veggie | Eat your veggies. | gen 🥦 |
| V | Voice | Sing with your voice. | emoji 🗣️ |
| W | Winton | Winton is a friend. | asset Winton.jpg 🐶 |
| W | Whale | A big whale. | gen 🐋 |
| W | Wolf | A wolf howls. | gen 🐺 |
| W | Worm | A wiggly worm. | gen 🪱 |
| X | X-ray | An x-ray of a bone. | gen 🦴 |
| X | Xylophone | Play the xylophone. | gen 🎵 |
| Y | Yard | Play in the yard. | gen 🌿 |
| Y | Yoga | Do yoga with Chilli. | gen 🧘 |
| Y | Yawn | A big yawn. | gen 🥱 |
| Y | Yellow | The sun is yellow. | emoji 💛 |
| Z | Zebra | A zebra has stripes. | gen 🦓 |
| Z | Zoo | Animals at the zoo. | gen 🦁 |
| Z | Zookeeper | A zookeeper feeds animals. | emoji 🧑‍🌾 |

## 5. 配图复用清单（从原目录拷贝）

来源根目录：`音频/经典041A.../9-...手工包+闪卡+涂色卡+壁纸/`

| 单词 | 来源文件 | 目标 |
|---|---|---|
| Bluey | 壁纸/Bluey.png | bluey/bluey.png |
| Bingo | 壁纸/Bingo.png 或 涂色卡/Bingo | bluey/bingo.png |
| Chilli | 壁纸/Chilli.png | bluey/chilli.png |
| Coco | 涂色卡/Coco | bluey/coco.png |
| Dad | 涂色卡/Dad | bluey/dad.png |
| Honey | 涂色卡/Honey | bluey/honey.png |
| Indy | 涂色卡/Indy | bluey/indy.png |
| Lucky | 涂色卡/Lucky | bluey/lucky.png |
| Muffin | 壁纸/Muffin.png | bluey/muffin.png |
| Mackenzie | 壁纸/Mackenzie-Wallpaper-scaled.jpg | bluey/mackenzie.png |
| Rusty | 涂色卡/Rusty | bluey/rusty.png |
| Socks | 壁纸/Socks-1.jpg | bluey/socks.png |
| Snickers | 壁纸/Snickers-wallpaper-scaled.jpg | bluey/snickers.png |
| Winton | 壁纸/Winton.jpg | bluey/winton.png |
| Fruitbat | 壁纸/Fruitbat1.jpg | bluey/fruitbat.png |
| Family | 壁纸/Family-1.jpg | bluey/family.png |
| Grannies | 壁纸/Grannies-2-768x1365.jpg | bluey/grannies.png |
| Pirates | 壁纸/Pirates.jpg | bluey/pirates.png |
| Trolley | 涂色/Trolley-combined.pdf | bluey/trolley.png |
| Typewriter | 涂色/Typewriter-Friends.pdf | bluey/typewriter.png |

> 涂色卡为线稿 PDF，需转成 PNG；壁纸为成品图，优先用壁纸。

## 6. 生图计划（布鲁伊主题）

对标记 `[gen]` 的通用名词，用生图技能生成「Bluey 风格卡通风 + 该物品/动物」的方形配图，统一尺寸 512×512，透明或浅色背景。

**第一批（优先生成，每字母 1 张主图，约 26 张）**：
Apple, Ball, Cat, Duck, Elephant, Frog, Giraffe, Horse, Iguana, Jellyfish, Kangaroo, Lion, Monkey, Nest, Octopus, Penguin, Queen, Rabbit, Sun, Tiger, Unicorn, Vacuum, Whale, X-ray, Yard, Zebra。

其余 `[gen]` 词在第二批补齐；`[emoji]` 兜底词保持 emoji。

## 7. 游戏集成

1. `index.html` 新增 `VOCAB_LIBRARIES` 结构，`currentLibrary` 默认 `'bluey'`。
2. `showLetterCard` / 挑战提示改用当前库的卡片数据；渲染 `image` 或 `emoji` + `word` + `sentence`。
3. 设置面板新增「词汇库」下拉切换（Bluey / Emoji）。
4. 数字卡（`NUMBER_MAP`）保持不变，不计入词汇库。
5. 兼容旧 `LETTER_MAP` 作为 `emoji` 库内容。

## 8. 落地步骤

1. ✅ 研究音频目录、提取词汇表。
2. 拷贝可复用素材到 `assets/bluey/`，PDF 转 PNG。
3. 生成第一批布鲁伊主题配图。
4. 实现 `VOCAB_LIBRARIES` 数据与游戏渲染。
5. 设置面板加词汇库切换。
6. 逐字母验证。
