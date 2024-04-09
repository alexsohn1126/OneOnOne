// tBD: the <a> tags need to be replaced with links or navlinks
import {Link, NavLink} from "react-router-dom";

export default function Header() {
    const page_name = window.location.pathname;
    const active_page = "text-active-link font-bold hover:text-hover-nav-link";
    const inactive_page = "text-non-active-link  hover:text-hover-nav-link";

    return(
        <>
        <header class="min-w-full min-h-12 bg-header text-white flex items-center text-left">
        <div class="hidden sm:flex container mx-auto">
            <ul class="flex space-x-4">
            <li>
                <NavLink to="/contacts" className={({ isActive }) => isActive ? active_page : inactive_page}>
                            My Contacts
                </NavLink>
            </li>
            <li>
                <NavLink to="/calendars" className={({ isActive }) => isActive ? active_page : inactive_page}>
                            My Calendars
                </NavLink>
            </li>
            <li>
                <NavLink to="/schedules" className={({ isActive }) => isActive ? active_page : inactive_page}>
                            My Schedules
                </NavLink>
            </li>
            <li>
                <NavLink to="/edit-profile" className={({ isActive }) => isActive ? active_page : inactive_page}>
                            Edit Profile
                </NavLink>
            </li>
            </ul>
        </div>
        <div className="flex flex-col items-center sm:hidden w-full min-h-12">
            <input id="dropdown" type="checkbox" className="hidden peer"/>
            <label htmlFor="dropdown" className="w-full h-12 flex justify-center items-center">
            <svg className="w-8 h-8 inline" viewBox="0 0 20 20">
                <path className="fill-green-1"
                d="M3.314,4.8h13.372c0.41,0,0.743-0.333,0.743-0.743c0-0.41-0.333-0.743-0.743-0.743H3.314
                c-0.41,0-0.743,0.333-0.743,0.743C2.571,4.467,2.904,4.8,3.314,4.8z M16.686,15.2H3.314c-0.41,0-0.743,0.333-0.743,0.743
                s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,15.2,16.686,15.2z M16.686,9.257H3.314
                c-0.41,0-0.743,0.333-0.743,0.743s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,9.257,16.686,9.257z"></path>
            </svg>
            </label>
            <div className="hidden peer-checked:flex peer-checked:justify-left bg-green-3  hover:bg-green-4 w-full p-2">
            <NavLink to="/contacts" className="text-active-link hover:text-hover-nav-link font-bold">My Contacts</NavLink>
            </div>
            <div className="hidden peer-checked:flex peer-checked:justify-left bg-green-3  hover:bg-green-4 w-full p-2">
            <NavLink to="/calendars" className="text-non-active-link hover:text-hover-nav-link ">My Calendars</NavLink>
            </div>
            <div className="hidden peer-checked:flex peer-checked:justify-left bg-green-3  hover:bg-green-4 w-full p-2">
            <NavLink to="/schedules" className="text-non-active-link hover:text-hover-nav-link">My Schedule</NavLink>
            </div>
            <div className="hidden peer-checked:flex peer-checked:justify-left bg-green-3  hover:bg-green-4 w-full p-2">
            <NavLink to="/edit-profile" className="text-non-active-link hover:text-hover-nav-link">Edit Profile</NavLink>
            </div>
        </div>
    </header>

        </>
    );
}