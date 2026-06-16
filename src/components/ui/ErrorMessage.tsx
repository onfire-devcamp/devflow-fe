interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center text-center text-sm text-red-500 w-full p-4">
      {message}
    </div>
  );
}
