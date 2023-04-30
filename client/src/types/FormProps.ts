export interface FormProps {
    labelName: string;
    type: string;
    name: string;
    placeholder: string;
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isSurpriseMe?: boolean;
    handleSurpriseMe?: () => void;
}
