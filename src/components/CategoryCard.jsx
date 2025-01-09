import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProgress } from '../services/dbService';
import '../styles/CategoryCard.css';

const CategoryCard = ({ title, path, description, problems }) => {
    const [solvedCount, setSolvedCount] = useState(0);
    const totalProblems = problems.reduce((acc, category) => acc + category.problems.length, 0);

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const allProgress = await getAllProgress();
                const categoryProgress = allProgress.filter(p =>
                    problems.some(cat => cat.title === p.id)
                );

                const solved = categoryProgress.reduce((acc, progress) => {
                    return acc + (progress.problems?.filter(p => p.completed)?.length || 0);
                }, 0);

                setSolvedCount(solved);
            } catch (error) {
                console.error('Error loading progress:', error);
            }
        };

        loadProgress();
    }, [problems]);

    const completionPercentage = (solvedCount / totalProblems) * 100;

    return (
        <Link to={path} className="category-card">
            <h2>{title}</h2>
            <p>{description}</p>
            <div className="progress-section">
                <div className="progress-stats">
                    <span className="progress-count">{solvedCount}/{totalProblems}</span>
                    <span className="progress-percentage">
                        {completionPercentage.toFixed(1)}%
                    </span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard; 