"use client"
import DealCard from '../components/DealCard';
import Image from 'next/image'
export default function Home() {
    return (
        <div className="container">
            <h1>Welcome to the Deal Card Drawer!</h1>
            <Image src="/6food.jpg"
            width={500}
      height={500}
      alt="Picture of the author"/>
            <DealCard />
        </div>
    );
}
