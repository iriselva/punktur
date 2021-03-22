import { useState } from 'react'
import { useCurrentUser } from "../hooks/user";
import { Editor } from '@tinymce/tinymce-react'
import Genres from '../components/Genres'
import { useRouter } from 'next/router'
import { route } from 'next/dist/next-server/server/router';

export default function NewStory() {
    const [user, { mutate }] = useCurrentUser();
    const router = useRouter()

    const handleCreateStory = async () => {
        const title = document.querySelector('#storyTitle').value;
        const story = tinymce.get('storyContent').getContent();
        const checkboxes = Array.from(document.querySelectorAll('input[name="genre"]'));
        const genres = checkboxes
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);

        const result = await fetch("/api/createStory", {
            method: "POST",
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({ 
                title: title,
                text: story,
                genres, 
                author: user.username,
                user_id: user._id 
            }),
        });
        const savedStory = await result.json();
        alert('Story posted'); // Success modal í staðinn fyrir alert ...
        route.push(`/stories/${savedStory._id}`);
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
            <button onClick={handleCreateStory}>Birta sögu</button>
        </div>
    )
}
