import PageBox from "./PageBox";
import HelpIcon from "../../media/help.png";

const HamburgerMenu = ({ user, onLogout, PAGES, page, setPage, setViewHelp, toggleMenu }) => (
    <div className="hamburger-menu">
        <span className="close-btn text-2xl cursor-pointer" onClick={toggleMenu}>&times;</span>
        <br />
        <PageBox user={user} onLogout={onLogout} pages={PAGES} page={page} setPage={setPage} />
        <br />
        <button
            key={"help"}
            className="add-button mr-2"
            onClick={() => setViewHelp(true)}
            title={"Help"}
        >
            <img height={30} width={30} src={HelpIcon} alt="Help" />
        </button>
        <br />
    </div>
);

export default HamburgerMenu;