/**
 * Drag & Drop Handler
 * Manages drag-and-drop reordering for social media channels
 */

import type { AppStateManager } from '../app/state';

export class DragDropHandler {
  private stateManager: AppStateManager;
  private draggedElement: HTMLElement | null = null;

  constructor(stateManager: AppStateManager) {
    this.stateManager = stateManager;
  }

  /**
   * Initialize drag-drop functionality
   */
  initialize(): void {
    this.setupDragListeners();
  }

  /**
   * Setup drag-and-drop event listeners
   */
  private setupDragListeners(): void {
    const socialCards = document.querySelectorAll('.social-channel-card');

    socialCards.forEach((card) => {
      const htmlCard = card as HTMLElement;

      // Make draggable
      htmlCard.setAttribute('draggable', 'true');

      // Drag start
      htmlCard.addEventListener('dragstart', (e) => {
        this.handleDragStart(e as DragEvent);
      });

      // Drag over
      htmlCard.addEventListener('dragover', (e) => {
        e.preventDefault();  // Allow drop
        this.handleDragOver(e as DragEvent);
      });

      // Drop
      htmlCard.addEventListener('drop', (e) => {
        e.preventDefault();
        this.handleDrop(e as DragEvent);
      });

      // Drag end
      htmlCard.addEventListener('dragend', () => {
        this.handleDragEnd();
      });
    });
  }

  /**
   * Handle drag start
   */
  private handleDragStart(event: DragEvent): void {
    this.draggedElement = event.target as HTMLElement;
    this.draggedElement.classList.add('dragging');

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', this.draggedElement.innerHTML);
    }
  }

  /**
   * Handle drag over
   */
  private handleDragOver(event: DragEvent): void {
    const target = event.target as HTMLElement;
    const card = target.closest('.social-channel-card') as HTMLElement;

    if (card && card !== this.draggedElement) {
      // Visual feedback
      card.classList.add('drag-over');
    }
  }

  /**
   * Handle drop
   */
  private handleDrop(event: DragEvent): void {
    if (!this.draggedElement) return;

    const target = event.target as HTMLElement;
    const dropTarget = target.closest('.social-channel-card') as HTMLElement;

    if (dropTarget && dropTarget !== this.draggedElement) {
      const container = dropTarget.parentElement;
      if (!container) return;

      // Determine drop position
      const rect = dropTarget.getBoundingClientRect();
      const midpoint = (rect.left + rect.right) / 2;
      const insertBefore = event.clientX < midpoint;

      // Reorder DOM elements
      if (insertBefore) {
        container.insertBefore(this.draggedElement, dropTarget);
      } else {
        container.insertBefore(this.draggedElement, dropTarget.nextSibling);
      }

      // Save new order
      this.saveOrder();
    }
  }

  /**
   * Handle drag end (cleanup)
   */
  private handleDragEnd(): void {
    // Remove visual feedback
    document.querySelectorAll('.social-channel-card').forEach((card) => {
      card.classList.remove('dragging', 'drag-over');
    });

    this.draggedElement = null;
  }

  /**
   * Save channel order to state and localStorage
   */
  private saveOrder(): void {
    const cards = document.querySelectorAll('.social-channel-card');
    const order = Array.from(cards).map((card) => {
      return (card as HTMLElement).dataset.channel || '';
    }).filter(Boolean);

    // Update state
    this.stateManager.setSocialOptions({ channels: order as any });
    this.stateManager.saveSocialOrder();
  }
}
