// Drag & Drop Interfaces
namespace App {
    export interface Draggable {
        dragStartHandler(event: DragEvent): void; // responsavel pelo agarrar e mover objeto
        dragEndHandler(event: DragEvent): void; // responsavel pelo soltar do objeto, informar o que ocorreu
    }

    export interface DragTarget {
        dragOverHandler(event: DragEvent): void;
        dropHandler(event: DragEvent): void;
        dragLeaveHandler(event: DragEvent): void;
    }
}
