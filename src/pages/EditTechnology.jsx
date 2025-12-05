import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TechnologyForm from '../components/TechnologyForm';
import useTechnologies from '../hooks/useTechnologies';
import './EditTechnology.css';

function EditTechnology() {
    const { techId } = useParams();
    const navigate = useNavigate();
    const { technologies, updateTechnology } = useTechnologies();
    const [technology, setTechnology] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        
        const loadTechnology = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 0));
                
                if (isMounted) {
                    const tech = technologies.find(t => t.id === parseInt(techId));
                    setTechnology(tech);
                    setIsLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Ошибка загрузки технологии:', error);
                    setIsLoading(false);
                }
            }
        };

        loadTechnology();

        return () => {
            isMounted = false;
        };
    }, [techId, technologies]);

    const handleSave = async (updatedData) => {
        try {
            await updateTechnology(parseInt(techId), updatedData);
        } catch (error) {
            console.error('Ошибка при обновлении технологии:', error);
            throw error;
        }
    };

    const handleCancel = () => {
        navigate(`/technology/${techId}`);
    };

    if (isLoading) {
        return (
            <div className="edit-technology-page">
                <div className="page-header">
                    <h1>Загрузка...</h1>
                </div>
            </div>
        );
    }

    if (!technology) {
        return (
            <div className="edit-technology-page">
                <div className="page-header">
                    <h1>Технология не найдена</h1>
                    <p>Технология с ID {techId} не существует.</p>
                    <Link to="/" className="btn btn-primary">
                        Назад к списку
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-technology-page">
            <div className="page-header">
                <Link to={`/technology/${techId}`} className="back-link">
                    Назад к технологии
                </Link>
                <h1>Редактирование технологии</h1>
            </div>

            <TechnologyForm 
                onSave={handleSave}
                onCancel={handleCancel}
                initialData={technology}
            />
        </div>
    );
}

export default EditTechnology;