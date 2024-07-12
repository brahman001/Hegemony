
import type { NextApiRequest, NextApiResponse } from 'next';
import { BusinessDeal } from '@/lib/board'; 

const BusinessDealcards: BusinessDeal[] = [
    { item: "Food", amount: 6, price: 40, tax: { "A": 12, "B": 6, "C": 0 }, imageUrl: "/6food.jpg" },
    { item: "Food", amount: 7, price: 50, tax: { "A": 14, "B": 7, "C": 0 }, imageUrl: "/7food.jpg" },
    { item: "Food", amount: 8, price: 55, tax: { "A": 16, "B": 8, "C": 0 }, imageUrl: "/8food.jpg" },
    { item: "Luxury", amount: 8, price: 30, tax: { "A": 16, "B":8, "C": 0 }, imageUrl: "/8Luxury.jpg" },
    { item: "Luxury", amount: 10, price: 40, tax: { "A": 20, "B":10, "C": 0 }, imageUrl: "/10Luxury.jpg" },
    { item: "Luxury", amount: 12, price: 50, tax: { "A": 24, "B":12, "C": 0 }, imageUrl: "/12Luxury.jpg" },
];

export default function handler(req: NextApiRequest, res: NextApiResponse<BusinessDeal | { error: string }>) {
    if (req.method === 'GET') {
        try {
            const randomIndex = Math.floor(Math.random() * BusinessDealcards.length);
            const randomCard = BusinessDealcards[randomIndex];
            res.status(200).json(randomCard);
        } catch (error) {
            console.error("Error fetching the card:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
