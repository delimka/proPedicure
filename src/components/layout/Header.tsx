import NavMenu from "../TopNavBar";
import MiddleNav from "./../BottomNavBar";

function Header() {
  return (
    <header className="flex flex-col">
      <NavMenu />
      <div className="hidden md:block">
        <MiddleNav />
      </div>
    </header>
  );
}

export default Header;
