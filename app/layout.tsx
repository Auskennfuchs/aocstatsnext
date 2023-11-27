import "../styles/globals.css"
import "@fortawesome/fontawesome-svg-core/styles.css"
import Head from "./head"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html>
            <head>
                <Head />
            </head>
            <body className="bg-slate-800 text-gray-100">{children}</body>
        </html>
    )
}
