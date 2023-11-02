// Interface for specific checkbox properties
export interface CheckboxProperties extends HTMLInputElement {
    type: string; // Type
    class: string; // Class
    id: string; // ID
    dataIndex: number; // Data Index
    checked: boolean; // Checked
}

// Interface for list items
export interface ItemList {
    id: number | string;
    name: string; // Name
    quantity: number; // Quantity
    price: number; // Price
    unit: string; // Unit
    selected: boolean; // Selected
}

// Interface for modal button configuration
export interface ModalButton {
    text: string; // Text
    value: "yes" | "no" | "confirm" | "cancel"; // Value
    style?: "primary" | "secondary" | "danger" | "info" | "success" | "error"  // Style (optional)
}

// Interface for modal configuration
export interface ModalProps {
    title?: string; // Title (optional)
    content?: string; // Content (optional)
    buttons?: ModalButton[]; // Buttons (array)
    result?: (result: "yes" | "no" | "confirm" | "cancel") => void; // Result
    icon?: string; // Icon
}

