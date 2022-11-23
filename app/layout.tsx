import "../styles/globals.css"
import '@fortawesome/fontawesome-svg-core/styles.css'

export default function RootLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <head />
            <body className="bg-gray-900 text-gray-100">
                {children}
            </body>
        </html>
    )
}
