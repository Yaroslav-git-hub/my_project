import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import './header_main.css';
import '../../Styles/icons.css';
const Main_index = () => {

    const [isProgramsHovered, setProgramsHovered] = useState(false);
    const [isSearchOpen, setSearchOpen] = useState(false);

    const handleSearchButtonClick = () => {
        setSearchOpen(true);
    };


    const handleModalClick = (e) => {
        // Предотвращаем всплытие события, чтобы оно не достигло родительских элементов
        e.stopPropagation();
    };

    const [text_logo, setTextLogo] = useState('');
    const logo_text = 'Full Stack Developer';

    const [text_dis, setTextDis] = useState('');
    const text_dissipation =
        'TriUnity — создавайте конспекты Full Stack разработки легко! Усвойте ключевые концепции, организуйте идеи, делитесь знаниями. Ваш путь к мастерству начинается здесь!';


    useEffect(() => {
        let logoIndex = 0;
        let dissipationIndex = 0;

        // Interval for logo_text
        const intervalLogo = setInterval(() => {
            if (logoIndex < logo_text.length) {
                setTextLogo(logo_text.substring(0, logoIndex + 1));
                logoIndex += 1;
            } else {
                clearInterval(intervalLogo);
            }
        }, 85); // Use the delays array

        // Interval for text_dissipation
        const intervalDissipation = setInterval(() => {
            if (dissipationIndex < text_dissipation.length) {
                setTextDis(text_dissipation.substring(0, dissipationIndex + 1));
                dissipationIndex += 1;
            } else {
                clearInterval(intervalDissipation);
            }
        }, 10); // Use the delays array

        return () => {
            clearInterval(intervalLogo);
            clearInterval(intervalDissipation);
        }; // Cleanup on component unmount
    }, []);

    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Выполняем запрос только если есть поисковый запрос
        if (searchTerm.trim() !== "") {
            fetch(`http://127.0.0.1:5000/posts?q=${searchTerm}`)
                .then(response => response.json())
                .then(data => setPosts(data));
        }
    }, [searchTerm]);

    const handleSearch = searchTerm => {
        // Устанавливаем поисковый запрос в состояние
        setSearchTerm(searchTerm);
    };

    const handleCloseModalInput = () => {
        setSearchOpen(false)
        setPosts([])
    }

    return (
        <>
            <header className="header">
                <div className="header__container">
                    <div className="header__top">
                        <div className="header__left">
                            <div className="header__logotype">
                                <div className="header__logo-svg">
                                    <svg width="60" height="60" viewBox="0 0 374 314" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M158 52.5L188.5 0L373.5 313.5H195.5L158 253L186 206L224 265.5H285.5L158 52.5Z" fill="white"/>
                                        <path d="M151 146.5L122 98.5L0 305.5L128 304L92.5 244.5L151 146.5Z" fill="white"/>
                                    </svg>
                                </div>
                                <div className="header__logo-name"><span>TriUnity</span></div>
                            </div>
                            <nav className="header__nav">
                                <ul className="header__nav-list">
                                    <li
                                        className="header__nav-item"
                                        onMouseEnter={() => setProgramsHovered(true)}
                                        onMouseLeave={() => setProgramsHovered(false)}
                                    >
                                        Программы
                                        <CSSTransition
                                            in={isProgramsHovered}
                                            timeout={300}
                                            classNames="submenu"
                                            unmountOnExit
                                        >
                                            <ul className="submenu">
                                                <li><i className="ri-javascript-fill"></i> JavaScript</li>
                                                <li><i className="ri-reactjs-fill"></i> React JS</li>
                                                <li><i className="ri-html5-fill"></i> HTML</li>
                                            </ul>
                                        </CSSTransition>
                                    </li>
                                    <li className="header__nav-item">События</li>
                                </ul>
                            </nav>
                        </div>
                        <div className="header__right">
                            <button className="header__btn header__search-btn" onClick={handleSearchButtonClick}><i className="ri-search-line"></i></button>
                            <button className="header__btn">Войти</button>
                            <button className="header__btn">Регистрация</button>
                        </div>
                        <CSSTransition
                            in={isSearchOpen}
                            timeout={300}
                            classNames="modal"
                            unmountOnExit
                        >
                            <div className="modal-overlay" onClick={handleCloseModalInput}>
                                <div className="header__search-modal" onClick={handleModalClick}>
                                    <div className="header__search-block">
                                        <button className="header__btn-search">
                                            <i className="ri-search-line"></i>
                                        </button>
                                        <input type="text" className="header__search-input" placeholder="Search" onChange={e => handleSearch(e.target.value)}/>
                                        <button className="header__btn-search" onClick={handleCloseModalInput}>
                                            <i className="ri-close-fill"></i>
                                        </button>
                                    </div>
                                    <div className="header__search-items">
                                        <ul className="header__search-list">
                                            {posts.map(post => (
                                                <li key={post.id} className="header__search-item">
                                                    <i className="ri-reactjs-fill"></i><strong>{post.title}</strong>: {post.content}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CSSTransition>
                    </div>
                    <div className="header__menu">
                        <div className="header__menu-logo">
                            <span>{text_logo}</span>
                        </div>
                        <div className="header__menu-description">{text_dis}</div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Main_index;
