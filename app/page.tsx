import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            麻雀何切るクイズ
          </h1>
          <p className="text-xl text-gray-600">
            麻雀の打牌選択力を鍛えよう！
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            ゲームの特徴
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">🎮 2つのゲームモード</h3>
              <p className="text-gray-700">
                4人麻雀と3人麻雀から選択可能。3人麻雀では筒子の2-8が除外されます。
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">📊 巡目設定</h3>
              <p className="text-gray-700">
                1巡目から18巡目まで設定可能。巡目に応じた手牌が生成されます。
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">💡 詳細な解説</h3>
              <p className="text-gray-700">
                なぜその牌を切るべきか、シャンテン数の変化と共に解説します。
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">📱 レスポンシブ対応</h3>
              <p className="text-gray-700">
                スマートフォンでもPCでも快適にプレイできます。
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/quiz"
            className="inline-block bg-green-600 text-white text-xl font-bold py-4 px-8 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            クイズを始める
          </Link>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">使い方</p>
          <ol className="text-left max-w-md mx-auto space-y-2">
            <li>1. ゲームモードと巡目を選択</li>
            <li>2. 表示された手牌から切る牌を選択</li>
            <li>3. 決定ボタンを押して答え合わせ</li>
            <li>4. 解説を読んで次の問題へ</li>
          </ol>
        </div>
      </div>
    </div>
  );
}