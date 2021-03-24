import { useState } from 'react'
import { useCurrentUser } from "../hooks/user";
import { Editor } from '@tinymce/tinymce-react'
import Genres from '../components/Genres'
import { useRouter } from 'next/router'
import { route } from 'next/dist/next-server/server/router';
import Image from 'next/image'

export default function NewStory() {
    const [user, { mutate }] = useCurrentUser();
    const router = useRouter()

    const handleCreateStory = async () => {
        const title = document.querySelector('#storyTitle').value;
        const story = tinymce.get('storyContent').getContent();
        const decodedStory = tinymce.html.Entities.decode(story)
        const pureStory = tinymce.get('storyContent').getContent({format : 'text'});
        const checkboxes = Array.from(document.querySelectorAll('input[name="genre"]'));
        const genres = checkboxes
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);

        const result = await fetch("/api/createStory", {
            method: "POST",
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({ 
                title: title,
                text: pureStory,
                html: decodedStory,
                genres, 
                author: user.username,
                user_id: user._id, 
                publishDate: new Date()
            }),
        });
        const savedStory = await result.json();
        alert('Story posted'); // Success modal í staðinn fyrir alert ...
        router.push(`/stories/${savedStory._id}`);
        console.log("POSTED!", savedStory);
        
        // Validate ...
    };

    return (
        <div>
            <input id='storyTitle' type='text' />
            <Editor
                id='storyContent'
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                init={{
                    selector: 'textarea',
                    skin_url: '/skins/ui/CUSTOM',
                    plugins: 'wordcount table', 
                    placeholder: 'Einu sinni var...',
                    skin: 'content',
                    // content_css: 'content',  
                    height: 500,
                    menubar: false,
                    toolbar: 'undo redo bold italic underline indent outdent styleselect',
                }} />
            <Genres />
            <button onClick={handleCreateStory}>
                <Image  
                    src="/Icons/BookOpen.svg"
                    alt="Ný saga"
                    width={24}
                    height={24}/>
                Birta sögu
            </button>
        </div>
    )
}
