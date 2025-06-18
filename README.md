# 🀄 麻雀何切るクイズアプリ

プロレベルの麻雀牌効率解析を搭載した何切るクイズアプリケーションです。

## 🎯 特徴

- **プロレベル解析**: 牌効率理論に基づく詳細な解析
- **リアルな麻雀卓**: 4人麻雀/3人麻雀対応の本格的なテーブル表示
- **多様な局面**: 1-18巡目の選択で難易度調整
- **美しいUI**: 実際の麻雀牌画像を使用した直感的なインターフェース
- **レスポンシブ対応**: モバイル・デスクトップ両対応

## 🚀 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **牌画像**: riichi-mahjong-tiles SVG
- **分析エンジン**: カスタム牌効率計算システム

## 📁 プロジェクト構成

```
mahjong-quiz-app/
├── app/
│   ├── components/
│   │   ├── EnhancedGameTable.tsx    # メインゲームテーブル
│   │   ├── MahjongTileImage.tsx     # 牌画像コンポーネント
│   │   ├── DiscardArea.tsx          # 捨て牌エリア
│   │   ├── OpponentHand.tsx         # 対戦相手の手牌
│   │   ├── ModeSelector.tsx         # ゲームモード選択
│   │   ├── TurnSelector.tsx         # 巡目選択
│   │   └── ProfessionalExplanation.tsx # プロ解説
│   ├── quiz/
│   │   └── page.tsx                # クイズページ
│   └── page.tsx                    # ホームページ
├── lib/
│   ├── mahjong.ts                  # 基本麻雀ロジック
│   ├── tileGeneration.ts           # 手牌生成
│   └── professionalAnalysis.ts     # プロレベル解析
├── types/
│   └── mahjong.ts                  # TypeScript型定義
└── public/
    └── tiles/                      # 麻雀牌SVG画像
```

## 🎮 機能詳細

### 麻雀解析システム

**解析項目**
- 受け入れ枚数計算
- シャンテン数変化
- 待ちの質評価（1-10）
- 安全度評価（1-10）
- 速度評価（1-10）
- 総合効率スコア

**戦略的要素**
- 序盤・中盤・終盤の局面判断
- 攻守バランスの最適化
- 役の可能性分析
- 危険牌判定

### ゲームモード

- **4人麻雀**: 東南西北の4人での対戦
- **3人麻雀**: 東南北の3人での対戦

### 難易度調整

巡目選択（1-18巡目）により、以下の要素が変化：
- 手牌の複雑さ
- 安全度の重要性
- 戦略的判断の必要性

## 🛠️ セットアップ

### 必要環境

- Node.js 18.x以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd mahjong-quiz-app

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### 牌画像の配置

`public/tiles/` ディレクトリに以下の牌画像を配置：

**数牌**
- `Man1.svg` ~ `Man9.svg` (萬子)
- `Pin1.svg` ~ `Pin9.svg` (筒子)  
- `Sou1.svg` ~ `Sou9.svg` (索子)

**字牌**
- `Ton.svg` (東)
- `Nan.svg` (南)
- `Shaa.svg` (西)
- `Pei.svg` (北)
- `Haku.svg` (白)
- `Hatsu.svg` (發)
- `Chun.svg` (中)

## 📱 使用方法

1. **ゲームモード選択**: 4人麻雀または3人麻雀を選択
2. **巡目設定**: 1-18巡目から選択（難易度調整）
3. **牌選択**: 手牌から捨てたい牌をクリック
4. **解析確認**: 「決定」ボタンでプロレベル解析を表示
5. **次の問題**: 新しい問題に挑戦

## 🎯 解析結果の見方

### 効率スコア
- **90点以上**: 最適解
- **80-89点**: 良手
- **70-79点**: 実用的
- **60-69点**: 改善の余地あり
- **60点未満**: 見直し推奨

### 評価項目
- **受け入れ枚数**: 次に有効な牌の種類数
- **待ちの質**: テンパイ時の待ちの良さ
- **安全度**: 他家からの当たり牌になりにくさ
- **速度評価**: アガリまでの早さ

## 🔧 カスタマイズ

### 解析アルゴリズムの調整

`lib/professionalAnalysis.ts` で各種パラメータを調整可能：

```typescript
// 攻守バランスの重み調整
const attackWeight = turn <= 9 ? 0.7 : 0.4;
const defenseWeight = turn <= 9 ? 0.3 : 0.6;
```

### 牌効率スコアの重み付け

```typescript
const attackScore = (
  shantenReduction * 30 +
  acceptanceTiles * 2 +
  waitQuality * 3 +
  speedRating * 2
);
```

## 🤝 貢献

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 ライセンス

MIT License

## 🙏 謝辞

- 牌画像: [riichi-mahjong-tiles](https://github.com/FluffyStuff/riichi-mahjong-tiles)
- 麻雀理論: 現代麻雀技術論・牌効率理論

---

**🎲 麻雀の楽しさを技術で表現 🎲**
