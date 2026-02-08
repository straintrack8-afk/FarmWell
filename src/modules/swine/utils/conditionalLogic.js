/**
 * Conditional Logic Utility
 * Handles question skip logic based on user answers
 */

/**
 * Evaluate if a question should be shown based on conditional logic
 * @param {object} question - Question object with conditional_logic
 * @param {object} allAnswers - All answers so far { questionId: answer }
 * @returns {boolean} - True if question should be shown
 */
export function shouldShowQuestion(question, allAnswers) {
    if (!question.conditional_logic) {
        return true; // No conditions, always show
    }

    const { if_answer, if_answer_includes, then: thenAction, else: elseAction, depends_on } = question.conditional_logic;

    // Check if depends on another question
    if (depends_on) {
        const dependsOnAnswer = allAnswers[depends_on];

        // If if_answer is specified, check exact match
        if (if_answer !== undefined) {
            if (dependsOnAnswer === if_answer) {
                return handleAction(thenAction);
            } else if (elseAction) {
                return handleAction(elseAction);
            } else {
                return false; // Don't show if condition not met and no else
            }
        }

        // If if_answer_includes is specified, check if answer includes value
        if (if_answer_includes !== undefined) {
            const answerArray = Array.isArray(dependsOnAnswer) ? dependsOnAnswer : [dependsOnAnswer];
            const includesValue = answerArray.includes(if_answer_includes);

            if (includesValue) {
                return handleAction(thenAction);
            } else if (elseAction) {
                return handleAction(elseAction);
            } else {
                return false;
            }
        }
    }

    return true; // Default to showing the question
}

/**
 * Handle conditional action (show, skip, goto)
 * @param {string} action - Action to take
 * @returns {boolean} - True if should show question
 */
function handleAction(action) {
    if (!action) return true;

    if (action === 'show') return true;
    if (action === 'skip') return false;
    if (action.startsWith('goto_question_')) return false; // Will be handled by getNextQuestion

    return true;
}

/**
 * Get the next question to show based on current question and answer
 * @param {array} questions - All questions in order
 * @param {number} currentIndex - Current question index
 * @param {object} currentAnswer - Answer to current question
 * @param {object} allAnswers - All answers so far
 * @returns {number} - Index of next question to show
 */
export function getNextQuestionIndex(questions, currentIndex, currentAnswer, allAnswers) {
    const currentQuestion = questions[currentIndex];

    // Check if current question has goto logic
    if (currentQuestion?.conditional_logic) {
        const { if_answer, if_answer_includes, then: thenAction, else: elseAction } = currentQuestion.conditional_logic;

        let shouldUseAction = false;
        let actionToUse = null;

        // Check if answer matches condition
        if (if_answer !== undefined && currentAnswer === if_answer) {
            shouldUseAction = true;
            actionToUse = thenAction;
        } else if (if_answer_includes !== undefined) {
            const answerArray = Array.isArray(currentAnswer) ? currentAnswer : [currentAnswer];
            if (answerArray.includes(if_answer_includes)) {
                shouldUseAction = true;
                actionToUse = thenAction;
            }
        }

        // If condition not met, use else action
        if (!shouldUseAction && elseAction) {
            actionToUse = elseAction;
        }

        // Handle goto action
        if (actionToUse && actionToUse.startsWith('goto_question_')) {
            const targetQuestionNumber = parseInt(actionToUse.replace('goto_question_', ''));
            const targetIndex = questions.findIndex(q => q.number === targetQuestionNumber);
            if (targetIndex !== -1) {
                return targetIndex;
            }
        }
    }

    // Default: go to next question
    let nextIndex = currentIndex + 1;

    // Skip questions that shouldn't be shown based on previous answers
    while (nextIndex < questions.length) {
        const nextQuestion = questions[nextIndex];
        if (shouldShowQuestion(nextQuestion, { ...allAnswers, [currentQuestion.id]: currentAnswer })) {
            return nextIndex;
        }
        nextIndex++;
    }

    return nextIndex; // Return even if beyond array (indicates completion)
}

/**
 * Get all applicable questions based on current answers
 * @param {array} questions - All questions
 * @param {object} answers - Current answers
 * @returns {array} - Array of questions that should be shown
 */
export function getApplicableQuestions(questions, answers = {}) {
    const applicable = [];

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        // Build answers up to this point
        const answersUpToNow = {};
        for (let j = 0; j < i; j++) {
            const prevQuestion = questions[j];
            if (answers[prevQuestion.id] !== undefined) {
                answersUpToNow[prevQuestion.id] = answers[prevQuestion.id];
            }
        }

        if (shouldShowQuestion(question, answersUpToNow)) {
            applicable.push(question);
        }
    }

    return applicable;
}

/**
 * Calculate total applicable questions for progress tracking
 * @param {array} questions - All questions
 * @param {object} answers - Current answers
 * @returns {number} - Total number of applicable questions
 */
export function getTotalApplicableQuestions(questions, answers = {}) {
    return getApplicableQuestions(questions, answers).length;
}

export default {
    shouldShowQuestion,
    getNextQuestionIndex,
    getApplicableQuestions,
    getTotalApplicableQuestions
};
