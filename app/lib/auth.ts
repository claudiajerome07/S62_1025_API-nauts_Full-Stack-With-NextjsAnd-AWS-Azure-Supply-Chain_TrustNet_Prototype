import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface DecodedToken {
  id: string;
  role: 'CUSTOMER' | 'BUSINESS_OWNER' | 'ADMIN';
  iat?: number;
  exp?: number;
}

export async function getServerSideAuth(): Promise<DecodedToken | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token.value, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export function getClientSideAuth(): DecodedToken | null {
  try {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return null;

    const payload = JSON.parse(atob(tokenParts[1]));
    return payload as DecodedToken;
  } catch (error) {
    console.error('Client auth error:', error);
    return null;
  }
}