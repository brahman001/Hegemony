'use client';
import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic'

const GameRun = dynamic(() =>
        import('../app/components/2player'), { ssr: false }
    )
export default function Home() {
    
    return (
        <GameRun />
    );

}
{/* <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <div> test</div>
    <div>
        <h1>Welcome to the Next.js App</h1>
        <Link href="/2-game" legacyBehavior>
            <a style={{ textDecoration: 'none' }}>
                <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
                    Go to 2-player game
                </button>
            </a>
        </Link>
    </div>
    <div>
        <h1>Welcome to the Next.js App</h1>
        <Link href="/test" legacyBehavior>
            <a style={{ textDecoration: 'none' }}>
                <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
                    Go to 2-player game
                </button>
            </a>
        </Link>
    </div>
</main> */}