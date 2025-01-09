import { useState, useRef, useEffect } from 'react';
import { saveProgress, getProgress } from '../services/dbService';
import '../styles/ProblemTracker.css';

const ProblemTracker = ({ category, onProblemToggle }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = useRef(null);
    const totalProblems = category.problems.length;
    const solvedProblems = category.problems.filter(prob => prob.completed).length;

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const savedProblems = await getProgress(category.title);
                if (savedProblems.length > 0) {
                    const updatedProblems = category.problems.map(problem => ({
                        ...problem,
                        completed: savedProblems.find(p => p.id === problem.id)?.completed || false
                    }));
                    onProblemToggle(category.title, null, updatedProblems);
                }
            } catch (error) {
                console.error('Error loading progress:', error);
            }
        };

        loadProgress();
    }, [category.title]);

    const handleCheckboxChange = async (problemId) => {
        const updatedProblems = category.problems.map(problem => {
            if (problem.id === problemId) {
                return { ...problem, completed: !problem.completed };
            }
            return problem;
        });

        try {
            await saveProgress(category.title, updatedProblems);
            onProblemToggle(category.title, problemId);
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    return (
        <div className="category-container">
            <div
                className="category-header"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="category-title">
                    <h3>{category.title}</h3>
                    <span className="counter">
                        {solvedProblems}/{totalProblems}
                    </span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${(solvedProblems / totalProblems) * 100}%` }}
                    />
                </div>
            </div>

            <div
                className={`problems-list-container ${isExpanded ? 'expanded' : ''}`}
                ref={contentRef}
            >
                <div className="problems-list">
                    {category.problems.map(problem => (
                        <div key={problem.id} className="problem-item">
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    checked={problem.completed}
                                    onChange={() => handleCheckboxChange(problem.id)}
                                />
                                <span className="checkmark"></span>
                            </label>
                            <a href={problem.link} target="_blank" rel="noopener noreferrer">
                                {problem.name}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProblemTracker; 