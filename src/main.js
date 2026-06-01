import './style.css'
import javascriptLogo from './assets/javascript.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { setupCounter } from './counter.js'
import dayjs from 'dayjs';

const API_URL = 'https://hiueqiuckfldxyjrqzaq.supabase.co/rest/v1/article?select=*';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdWVxaXVja2ZsZHh5anJxemFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDMwNDEzOSwiZXhwIjoyMDk1ODgwMTM5fQ.oDpPcftMS19aLBMaJN6mMV57EVUKurDG8pbWart5ZLw';

const fetchArticles = async (order = 'created_at.asc') => {
    try {
        const response = await fetch(`${API_URL}&order=${order}`, {
            headers: {
                apikey: API_KEY,
            }
        });
        const data = await response.json();
        console.log(data)
        renderArticles(data)
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

const renderArticles = (articles) => {
    const container = document.getElementById('articles');
    container.innerHTML = '';

    articles.forEach(article => {
        container.innerHTML += `
            <div class="bg-white rounded-xl shadow p-6">
                <h2 class="text-xl font-bold">${article.title}</h2>
                <h3 class="text-gray-500 mb-2">${article.subtitle}</h3>
                <p class="text-sm text-gray-400 mb-4">
                    Autor: ${article.author} | Data: ${dayjs(article.created_at).format('DD-MM-YYYY')}
                </p>
                <p class="text-gray-700">${article.content}</p>
            </div>
        `;
    });
};

const submit = document.getElementById('submit')

const createNewArticle = async (title, subtitle, author, content) => {
    try {
        const response = await fetch('https://hiueqiuckfldxyjrqzaq.supabase.co/rest/v1/article', {
            method: 'POST',
            headers: {
                apikey: API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, subtitle, author, content }),
        });
        if (response.status !== 201) {
            throw new Error(`Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

document.getElementById('articleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;
    await createNewArticle(title, subtitle, author, content);
    document.getElementById('articleForm').reset();
    fetchArticles();
});

document.getElementById('sortSelect').addEventListener('change', (e) => {
    fetchArticles(e.target.value);
});

fetchArticles();
