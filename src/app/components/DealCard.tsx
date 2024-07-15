// components/DealCard.tsx
import React, { useState } from 'react';
import Image from 'next/image';

const DealCard: React.FC = () => {
    const [imageUrl, setImageUrl] = useState('');

    const fetchCard = async () => {
        try {
            const response = await fetch('../api/deck');
            
            const data = await response.json();
            setImageUrl(data.imageUrl);
        } catch (error) {
            console.error('Failed to fetch card:', error);
            alert('Failed to load the card');
        }
    };

    return (
        <div>
            <button onClick={fetchCard}>Draw a Card</button>
            {imageUrl && <Image src={imageUrl} alt="Deal Card" style={{ maxWidth: 'auto', height: 'auto' }} />}
        </div>
    );
};

export default DealCard;
