import MyLink from "./MyLink";
import { useCurrentUser } from "../hooks/user";
import Image from 'next/image'
import styles from '../styles/Navbar.module.css'

export default function Navbar() {
    const [user, { mutate }] = useCurrentUser();
    
    // fetching delete request from api/auth
    const handleLogout = async () => {
        await fetch("/api/auth", {
            method: "DELETE",
        });
        // setting user state to null
        mutate(null);
    };
    return (
        <nav className={styles.nav}>
            <div className={styles.logo}>
                {!user ? '' : (
                    <MyLink href="/">
                        <Image  
                            src="/Icons/NavbarLogo.svg"
                            alt="heim"
                            width={32}
                            height={32}/>
                    </MyLink>
                )}
            </div>
            <div className={styles.write}>
                {!user ? '' : (
                    <MyLink href="/ny-saga" className={styles.abc} >
                        <Image  
                            src="/Icons/write.svg"
                            alt="Ný saga"
                            width={32}
                            height={32}/>
                    </MyLink>
                )}
            </div>
            <div className={styles.user}>
                {!user ? '' : (
                    <MyLink href="/min-sida">
                        <Image  
                            src="/Icons/User.svg"
                            alt="mín síða"
                            width={32}
                            height={32}/>
                    </MyLink>
                )}
            </div>
            {/* <MyLink href="/um-punkt">
                {/* <a>Um punkt</a> */}
                {/* <Image  
                            src="/Icons/User.svg"
                            alt="um punkt"
                            width={32}
                            height={32}/> */}
            {/* </MyLink>  */}
            {/* <div>
                {!user ? (
                    <MyLink href="/skra-inn">
                        {/* <a>Skrá inn</a> */}
                        {/* <Image  
                            src="/Icons/SignIn.svg"
                            alt="skrá inn"
                            width={32}
                            height={32}/>
                    </MyLink>
                ) : ( */}
                    {/* <a tabIndex={0} role="button" onClick={handleLogout}>
                        {/* Skrá út */}
                        {/* <Image  
                            src="/Icons/SignOut.svg"
                            alt="skrá út"
                            width={32}
                            height={32}/>
                    </a> */}
            {/*                 
            </div> */}
            {/* <div>
                {!user ? '' : (
                    <MyLink href="/stillingar">
                        {/* <a>Stillingar</a> */}
                        {/* <Image  
                            src="/Icons/stillingar.svg"
                            alt="Stillingar"
                            width={32}
                            height={32}/>
                    </MyLink>
                )} */}
            {/* </div> */}
        </nav>
    );
}
