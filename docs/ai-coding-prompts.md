# AI Coding Prompts

这些提示词可以直接复制给 Codex、Cursor、Claude Code 或其他 AI Coding 工具。

## 处理待补充单词

```text
请处理待补充单词：
1. 读取 data/pending-words.json；
2. 找出 status 为 pending 的单词；
3. 为每个单词补充幼儿友好的英文句子、颜色、图片和语音；
4. 更新 src/data/cards.ts、assets/bluey/、assets/audio/manifest.json 和相关音频；
5. 保持现有词库结构和朗读格式；
6. 运行 npm test、npm run build、npm run electron:check；
7. 完成验证并提交。
```

## 调整游戏设置

```text
请调整游戏设置：
把我描述的设置改动实现到本地应用里，保持其他行为不变。
先定位相关模块，写或更新测试，运行 npm test、npm run build、npm run electron:check，完成验证并提交。
```

## 新增家长设置

```text
请新增家长设置：
在家长面板增加我描述的控制项，并把设置保存到本地状态。
不要影响孩子玩的主界面。请补测试，运行 npm test、npm run build、npm run electron:check，完成验证并提交。
```

## 完成验证并提交

```text
请检查当前改动是否完整：
1. 运行 npm test；
2. 运行 npm run build；
3. 运行 npm run electron:check；
4. 查看 git status 和 git diff；
5. 如果验证通过，按项目提交规范 git commit；
6. 提交信息不要加 Co-Authored-By 或 AI 署名。
```
