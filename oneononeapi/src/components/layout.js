import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

export default function HeaderLayout() {
    return (
        <>
            <Header/>
            <Outlet/> 
            {/* <Footer/> */}
        </>
    );

}