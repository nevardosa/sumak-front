import { Injectable, signal } from '@angular/core';
import { Order, OrderStatus, CartItem } from '../models/catalog.models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly orders = signal<Order[]>([]);

  createOrder(customerData: {
    name: string;
    email: string;
    phone: string;
  }, items: CartItem[], notes?: string): Order {
    const order: Order = {
      id: this.generateOrderId(),
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
      items: [...items],
      total: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes
    };

    // Guardar en localStorage (simulando archivo plano)
    this.saveOrderToStorage(order);
    
    // Actualizar signal
    const currentOrders = this.orders();
    this.orders.set([...currentOrders, order]);

    return order;
  }

  getOrders(): Order[] {
    return this.orders();
  }

  getOrdersByStatus(status: OrderStatus): Order[] {
    return this.orders().filter(order => order.status === status);
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const currentOrders = this.orders();
    const updatedOrders = currentOrders.map(order =>
      order.id === orderId
        ? { ...order, status, updatedAt: new Date() }
        : order
    );
    
    this.orders.set(updatedOrders);
    this.saveAllOrdersToStorage(updatedOrders);
  }

  loadOrdersFromStorage(): void {
    try {
      const storedOrders = localStorage.getItem('sumak_orders');
      if (storedOrders) {
        const orders = JSON.parse(storedOrders);
        // Convertir strings de fecha a objetos Date
        const parsedOrders = orders.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
          items: order.items.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }))
        }));
        this.orders.set(parsedOrders);
      }
    } catch (error) {
      console.error('Error loading orders from storage:', error);
    }
  }

  private saveOrderToStorage(order: Order): void {
    try {
      const currentOrders = this.getStoredOrders();
      currentOrders.push(order);
      localStorage.setItem('sumak_orders', JSON.stringify(currentOrders));
    } catch (error) {
      console.error('Error saving order to storage:', error);
    }
  }

  private saveAllOrdersToStorage(orders: Order[]): void {
    try {
      localStorage.setItem('sumak_orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders to storage:', error);
    }
  }

  private getStoredOrders(): Order[] {
    try {
      const stored = localStorage.getItem('sumak_orders');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting stored orders:', error);
      return [];
    }
  }

  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `SUMAK-${timestamp}-${randomStr}`.toUpperCase();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  getOrderStatusLabel(status: OrderStatus): string {
    const labels = {
      [OrderStatus.PENDING]: 'Pendiente',
      [OrderStatus.CONFIRMED]: 'Confirmado',
      [OrderStatus.IN_PROCESS]: 'En Proceso',
      [OrderStatus.DELIVERED]: 'Entregado',
      [OrderStatus.CANCELLED]: 'Cancelado'
    };
    return labels[status];
  }

  getOrderStatusColor(status: OrderStatus): string {
    const colors = {
      [OrderStatus.PENDING]: 'text-yellow-600 bg-yellow-50',
      [OrderStatus.CONFIRMED]: 'text-blue-600 bg-blue-50',
      [OrderStatus.IN_PROCESS]: 'text-sumak-green bg-sumak-green/10',
      [OrderStatus.DELIVERED]: 'text-green-600 bg-green-50',
      [OrderStatus.CANCELLED]: 'text-red-600 bg-red-50'
    };
    return colors[status];
  }
}