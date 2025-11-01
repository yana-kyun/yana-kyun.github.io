function practiceTouch(data) {
    let attempts = 0;
    const container = document.querySelector('.image-container');
    const mainContainer = document.querySelector('.container');
    const feedback = document.getElementById('feedback');
    const feedbackBlock = document.getElementById('feedback-block');
    const explanation = document.getElementById('explanation');
    const submitBtn = document.getElementById('submit-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const footer = document.getElementById('footer');
    const practiceName = data.practiceName;
    const findTheDifference = data.findTheDifference;
    const squareBorder = data.squareBorder;
    const selectBorderColor = data.selectBorderColor;

    // Функция для проверки ширины контейнера
    const checkContainerSize = () => {
        return mainContainer.clientWidth <= 719;
    };

    // Определяем начальный набор данных для областей
    let useMobileAreas = checkContainerSize();
    let areasToUse = useMobileAreas ? data.areasDataXs : data.areasData;

    // Функция для проверки выбранных областей и обновления состояния кнопки
    const updateSubmitButtonState = () => {
        const selectedAreas = document.querySelectorAll('.clickable-area.selected');
        submitBtn.disabled = selectedAreas.length === 0;
    };

    // Функция создания областей
    const createAreas = (areasData) => {
        // Очищаем существующие области
        document.querySelectorAll('.clickable-area').forEach(area => area.remove());
        
        // Создаём новые области
        areasData.forEach((area, index) => {
            const div = document.createElement('div');
            div.classList.add('clickable-area');
            div.dataset.correct = area.correct;
            div.style.top = area.top;
            div.style.left = area.left;
            div.style.width = area.width;
            div.style.height = area.height;
            div.dataset.index = index;

            if (findTheDifference) {
                div.classList.add('clickable-area-find');
            }

            if (squareBorder) {
                div.classList.add('square-border');
            }

            div.addEventListener('click', function handleClick() {
                if (!div.classList.contains('disabled')) {
                    div.classList.toggle('selected');
                    if (selectBorderColor && div.classList.contains('selected')) {
                        div.style.borderColor = selectBorderColor;
                    }
                    updateSubmitButtonState();
                }
            });

            container.appendChild(div);
        });
    };

    // Инициализация областей
    createAreas(areasToUse);

    // Инициализируем состояние кнопки (заблокирована)
    submitBtn.disabled = true;

    // Функция для блокировки всех кликабельных областей
    const disableAllAreas = () => {
        document.querySelectorAll('.clickable-area').forEach(area => {
            area.classList.add('disabled');
        });
    };

    // Функция для разблокировки всех кликабельных областей
    const enableAllAreas = () => {
        document.querySelectorAll('.clickable-area').forEach(area => {
            area.classList.remove('disabled');
        });
    };

    // Обработчик отправки ответа
    submitBtn.addEventListener('click', () => {
        attempts++;

        let allCorrect = true;
        let anyWrong = false;

        const allAreas = document.querySelectorAll('.clickable-area');

        // Сначала удаляем все классы correct/incorrect
        allAreas.forEach(area => {
            area.classList.remove('correct', 'incorrect');
        });

        allAreas.forEach(area => {
            const isSelected = area.classList.contains('selected');
            const isCorrect = area.dataset.correct === 'true';

            if (isCorrect && !isSelected) allCorrect = false;
            if (!isCorrect && isSelected) anyWrong = true;

            // Добавляем классы ТОЛЬКО к выбранным областям
            if (isSelected) {
                if (isCorrect) {
                    area.classList.add('correct');
                } else {
                    area.classList.add('incorrect');
                }
            }
        });

        // Блокируем все области после проверки
        disableAllAreas();

        if (allCorrect && !anyWrong) {
            feedbackBlock.classList.remove('hidden');
            explanation.classList.remove('hidden');
            feedback.textContent = data.textCorrect;
            submitBtn.classList.add('hidden');
            footer.classList.remove('hidden');
            CLV.oGlobal['practice'][practiceName] = true;
        } else {
            if (attempts < data.maxAttempts) {
                feedbackBlock.classList.remove('hidden');
                feedback.textContent = data.textIncorrect;
                submitBtn.classList.add('hidden');
                repeatBtn.classList.remove('hidden');
            } else {
                feedbackBlock.classList.remove('hidden');
                feedback.textContent = data.textIncorrect;
                explanation.classList.remove('hidden');
                submitBtn.classList.add('hidden');
                
                // Показываем все правильные области (даже невыбранные)
                allAreas.forEach(area => {
                    if (area.dataset.correct === 'true') {
                        area.classList.add('correct');
                    }
                });

                footer.classList.remove('hidden');
            }
        }
        scrollToContent(2);
    });

    // Обработчик повторной попытки
    repeatBtn.addEventListener('click', () => {
        feedbackBlock.classList.add('hidden');
        // Очищаем классы correct/incorrect при повторной попытке
        document.querySelectorAll('.clickable-area').forEach(area => {
            area.classList.remove('correct', 'incorrect', 'selected', 'disabled');
        });
        submitBtn.classList.remove('hidden');
        repeatBtn.classList.add('hidden');
        enableAllAreas(); // Разблокируем области для повторного выбора
        updateSubmitButtonState(); // Обновляем состояние кнопки
    });

    // Наблюдатель за изменением размера контейнера
    const resizeObserver = new ResizeObserver(() => {
        const newUseMobileAreas = checkContainerSize();
        if (newUseMobileAreas !== useMobileAreas) {
            useMobileAreas = newUseMobileAreas;
            areasToUse = useMobileAreas ? data.areasDataXs : data.areasData;
            createAreas(areasToUse);
            updateSubmitButtonState();
        }
    });

    // Начинаем наблюдение за изменением размера контейнера
    resizeObserver.observe(mainContainer);

    // Функция для очистки при уничтожении
    return {
        destroy() {
            resizeObserver.disconnect();
        }
    };
}