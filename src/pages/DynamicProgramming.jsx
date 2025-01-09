import { useState, useEffect } from 'react';
import { dpCategories } from '../data/dpProblems';
import ProblemTracker from '../components/ProblemTracker';
import { getAllProgress } from '../services/dbService';
import '../styles/DynamicProgramming.css';

const DynamicProgramming = () => {
    const [categories, setCategories] = useState(dpCategories);

    useEffect(() => {
        const loadAllProgress = async () => {
            try {
                const allProgress = await getAllProgress();
                if (allProgress.length > 0) {
                    const updatedCategories = categories.map(category => {
                        const categoryProgress = allProgress.find(p => p.id === category.title);
                        if (categoryProgress) {
                            return {
                                ...category,
                                problems: category.problems.map(problem => ({
                                    ...problem,
                                    completed: categoryProgress.problems.find(p => p.id === problem.id)?.completed || false
                                }))
                            };
                        }
                        return category;
                    });
                    setCategories(updatedCategories);
                }
            } catch (error) {
                console.error('Error loading all progress:', error);
            }
        };

        loadAllProgress();
    }, []);

    const handleProblemToggle = (categoryTitle, problemId, updatedProblems = null) => {
        const newCategories = categories.map(category => {
            if (category.title === categoryTitle) {
                if (updatedProblems) {
                    return {
                        ...category,
                        problems: updatedProblems
                    };
                }
                return {
                    ...category,
                    problems: category.problems.map(problem => {
                        if (problem.id === problemId) {
                            return { ...problem, completed: !problem.completed };
                        }
                        return problem;
                    })
                };
            }
            return category;
        });

        setCategories(newCategories);
    };

    // Calculate totals
    const totalProblems = categories.reduce(
        (acc, category) => acc + category.problems.length,
        0
    );

    const solvedProblems = categories.reduce(
        (acc, category) => acc + category.problems.filter(p => p.completed).length,
        0
    );

    const completionPercentage = (solvedProblems / totalProblems) * 100;

    return (
        <div className="dp-container">
            <div className="header-section">
                <div className="overall-progress">
                    <div className="progress-stats">
                        <span className="progress-count">{solvedProblems}/{totalProblems}</span>
                        <span className="progress-percentage">
                            {completionPercentage.toFixed(1)}%
                        </span>
                    </div>
                    <div className="overall-progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="categories">
                {categories.map(category => (
                    <ProblemTracker
                        key={category.title}
                        category={category}
                        onProblemToggle={handleProblemToggle}
                    />
                ))}
            </div>
        </div>
    );
};

export default DynamicProgramming; 