import { dpCategories } from '../data/dpProblems';
import { graphCategories } from '../data/graphProblems';
import { twoPointerCategories } from '../data/twoPointerProblems';
import { pages } from '../data/pages';
import CategoryCard from '../components/CategoryCard';
import '../styles/Home.css';

const getCategoryProblems = (type) => {
    switch (type) {
        case 'dp':
            return dpCategories;
        case 'graph':
            return graphCategories;
        case 'two-pointers':
            return twoPointerCategories;
        default:
            return [];
    }
};

const Home = () => {
    return (
        <div className="home-container">
            <h1>Problems Checklist</h1>
            <div className="categories-grid">
                {pages.map(page => (
                    <CategoryCard
                        key={page.path}
                        {...page}
                        problems={getCategoryProblems(page.path.slice(1))}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home; 