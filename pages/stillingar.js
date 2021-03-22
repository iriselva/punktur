import styles from "../styles/Home.module.css";
import { useCurrentUser } from "../hooks/user";
import React, { useState, useEffect, useRef } from "react";
import Modal from "../components/modal";
import { useRouter } from "next/router";

import Link from "next/link";

export default function Settings() {
    const router = useRouter();
    const [user] = useCurrentUser();
    const [isOpen, setModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const formRef = useRef();
    const [msg, setMsg] = useState({ message: "", isError: false });

    useEffect(() => {
        // initializing user data in form input
        if (formRef.current) {
            const form = formRef.current;
            form.email.value = user.email;
            form.username.value = user.username;
            form.bio.value = bio.username ?? "";
        }
    }, [user]);
    // read data from form to be saved
    const getFormData = () => {
        const form = formRef.current;
        return {
            email: form.email.value,
            username: form.username.value,
            bio: form.bio.value,
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // disable submitting while updating is in progress
        if (isUpdating) return;
        setIsUpdating(true);
        console.log(user);

        const res = await fetch("api/user", {
            method: "PATCH",
            body: JSON.stringify(getFormData()),
        });
        if (res.status === 200) {
            setMsg({ message: "Prófíll uppfærður" });
        } else if (res.status === 500) {
            setMsg({ message: "Eitthvað fór úrskeiðis, reyndu aftur", isError: true });
        } else {
            setMsg({ message: await res.text(), isError: true });
        }
        setIsUpdating(false);
    };

    const handleDeleteUser = async (e) => {
        e.preventDefault();

        const res = await fetch("api/user", {
            method: "DELETE",
        });
        setModalOpen(false);
        if(res.ok) {
            router.push("/?showUserDeleteMessage=true")
        } else {
            setMsg({ message: "Eitthvað fór úrskeiðis, reyndu aftur", isError: true });
        }
    };


    return (
        <div>
            {!user ? (
                "Það þarf að skrá sig inn til þess að sjá prófílinn sinn"
            ) : (
                <div>
                    <div>
                        <Link href="/min-sida">
                            <a>Til baka</a>
                        </Link>
                        <h2>Stillingar</h2>
                    </div>

                    <form onSubmit={handleSubmit} ref={formRef}>
                        {msg.message ? <p style={{ color: msg.isError ? "red" : "#0070f3", textAlign: "center" }}>{msg.message}</p> : null}
                        <div>
                            <label htmlFor="username">
                                Nafn/Höfundarnafn
                                <input required id="username" name="username" type="text" />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="email">
                                Netfang
                                <input id="email" name="email" type="email" />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="bio">
                                Um mig
                                <textarea id="bio" name="bio" maxLength="50" />
                            </label>
                        </div>
                        <button disabled={isUpdating} type="submit">
                            Vista breytingar
                        </button>
                    </form>

                    <button onClick={() => setModalOpen(true)}>Eyða aðgangi</button>
                        <Modal 
                            show={isOpen }
                            title="Ertu viss um að þú viljir eyða aðgangi þínum?"
                            onSubmit={handleDeleteUser}
                            onClose={() => setModalOpen(false)}
                            submitText="Já"
                            cancelText="Nei, hætta við"
                        >
                            <p>Her er texti sem þú vilt setja i dialoginn</p>
                        </Modal>
                </div>
            )}
        </div>
    );
}
