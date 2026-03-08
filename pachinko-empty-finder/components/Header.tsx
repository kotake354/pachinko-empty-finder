import Link from "next/link";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-8">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        パチンコ情報共有アプリ
                    </span>
                </Link>
                <div className="ml-auto flex items-center gap-6">
                    <Link href="/posts" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                        投稿一覧
                    </Link>
                    <Link href="/area" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                        エリア検索
                    </Link>
                    <Link href="/hall" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                        ホール検索
                    </Link>
                    <Link href="/post" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm">
                        投稿する
                    </Link>
                </div>
            </div>
        </header>
    );
}
