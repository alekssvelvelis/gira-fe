import ThemeToggle from "@/components/header/ThemeToggle";

export const Header = () => {
    return (
        <header className="min-w-screen bg-mint-500 h-24 flex">
            <div className="w-full h-full flex flex-row">
              <ThemeToggle />
            </div>
        </header>
    )
}