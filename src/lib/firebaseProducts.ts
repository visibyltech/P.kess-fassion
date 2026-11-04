import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  type Unsubscribe
} from 'firebase/firestore';
import type { Product } from '../types';
import { firestore } from './firebase';

const productsCollection = collection(firestore, 'products');

export async function fetchFirebaseProducts(): Promise<Product[]> {
  const snapshot = await getDocs(query(productsCollection));
  return snapshot.docs.map(item => ({ ...(item.data() as Product), id: item.id }));
}

export function subscribeToFirebaseProducts(
  onProducts: (products: Product[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    query(productsCollection),
    snapshot => onProducts(snapshot.docs.map(item => ({ ...(item.data() as Product), id: item.id }))),
    error => onError?.(error)
  );
}

export async function createFirebaseProduct(product: Omit<Product, 'id'>): Promise<string> {
  const result = await addDoc(productsCollection, {
    ...product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return result.id;
}

export async function updateFirebaseProduct(id: string, updates: Partial<Product>): Promise<void> {
  await updateDoc(doc(firestore, 'products', id), {
    ...updates,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteFirebaseProduct(id: string): Promise<void> {
  await deleteDoc(doc(firestore, 'products', id));
}
