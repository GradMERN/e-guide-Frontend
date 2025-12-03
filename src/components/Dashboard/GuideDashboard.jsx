import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const GuideDashboard = () => {
    const { user } = useContext(AuthContext);
    const [tours, setTours] = useState([]);
    const [newTour, setNewTour] = useState({ title: '', description: '', price: '' });

    useEffect(() => {
        // Fetch tours created by the guide
        const fetchTours = async () => {
            try {
                const response = await fetch(`/api/tours?guideId=${user.id}`);
                const data = await response.json();
                setTours(data);
            } catch (error) {
                console.error('Failed to fetch tours:', error);
            }
        };
        if (user) fetchTours();
    }, [user]);

    const handleAddTour = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/tours', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newTour, guideId: user.id }),
            });
            const data = await response.json();
            setTours([...tours, data]);
            setNewTour({ title: '', description: '', price: '' });
        } catch (error) {
            console.error('Failed to add tour:', error);
        }
    };

    return (
        <div>
            <h1>Guide Dashboard</h1>
            <form onSubmit={handleAddTour}>
                <input
                    type="text"
                    placeholder="Title"
                    value={newTour.title}
                    onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={newTour.description}
                    onChange={(e) => setNewTour({ ...newTour, description: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={newTour.price}
                    onChange={(e) => setNewTour({ ...newTour, price: e.target.value })}
                    required
                />
                <button type="submit">Add Tour</button>
            </form>
            <h2>Your Tours</h2>
            <ul>
                {tours.map((tour) => (
                    <li key={tour.id}>
                        <h3>{tour.title}</h3>
                        <p>{tour.description}</p>
                        <p>Price: ${tour.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GuideDashboard;
