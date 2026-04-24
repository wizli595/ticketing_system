"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRequest } from "@/hooks/use-request";
import { ErrorAlert, Spinner } from "@/components/FormComponents";
import { Category } from "@/lib/api";

interface NewTicketFormProps {
    categories: Category[];
}

export function NewTicketForm({ categories }: NewTicketFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [isOther, setIsOther] = useState(false);
    const [customCategory, setCustomCategory] = useState("");
    const [creatingCategory, setCreatingCategory] = useState(false);

    const { doRequest, errors, isLoading } = useRequest({
        url: "/api/tickets",
        method: "post",
        body: {
            title,
            price,
            ...(categoryId && categoryId !== "__other__" ? { categoryId } : {}),
        },
        onSuccess: () => router.push("/tickets"),
    });

    const handleCategoryChange = (value: string) => {
        if (value === "__other__") {
            setIsOther(true);
            setCategoryId("__other__");
        } else {
            setIsOther(false);
            setCustomCategory("");
            setCategoryId(value);
        }
    };

    const handleCreateCategory = async () => {
        const name = customCategory.trim();
        if (!name) return;

        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        setCreatingCategory(true);

        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, slug }),
                credentials: "include",
            });

            if (!res.ok) {
                const data = await res.json();
                const msg =
                    data?.[0]?.message ||
                    data?.errors?.[0]?.message ||
                    "Failed to create category";
                alert(msg);
                return;
            }

            const newCat = await res.json();
            setCategoryId(newCat.id);
            setIsOther(false);
            setCustomCategory("");
            // Add to local list so it shows in the dropdown
            categories.push(newCat);
        } catch {
            alert("Failed to create category");
        } finally {
            setCreatingCategory(false);
        }
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isOther && customCategory.trim()) {
            // Create the category first, then submit
            await handleCreateCategory();
            // After creating, doRequest will use the updated categoryId
            // We need to wait for state update, so let the next render handle it
            return;
        }
        await doRequest();
    };

    // If we just created a category and categoryId is set, auto-submit
    const onBlur = () => {
        const value = parseFloat(price);
        if (!isNaN(value)) {
            setPrice(value.toFixed(2));
        }
    };

    const selectedCatName = categories.find((c) => c.id === categoryId)?.name;

    return (
        <div className="section py-10">
            <div className="max-w-lg mx-auto">
                <div className="mb-8">
                    <Link
                        href="/tickets"
                        className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer mb-4"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                            />
                        </svg>
                        Back to tickets
                    </Link>
                    <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">
                        Create a Ticket
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        List your event ticket for sale
                    </p>
                </div>

                <div className="glass-card p-8">
                    <form onSubmit={onSubmit} className="space-y-6">
                        <ErrorAlert errors={errors} />

                        <div>
                            <label htmlFor="title" className="label">
                                Ticket Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input-field"
                                placeholder="e.g., Concert - The Beatles Tribute Band"
                                required
                                disabled={isLoading}
                                minLength={3}
                                maxLength={100}
                            />
                            <p className="text-xs text-slate-400 mt-1.5">
                                Describe the event or ticket type
                            </p>
                        </div>

                        <div>
                            <label htmlFor="category" className="label">
                                Category
                            </label>
                            <select
                                id="category"
                                value={isOther ? "__other__" : categoryId}
                                onChange={(e) =>
                                    handleCategoryChange(e.target.value)
                                }
                                className="input-field"
                                disabled={isLoading || creatingCategory}
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                                <option value="__other__">
                                    + Other (create new)
                                </option>
                            </select>

                            {/* Custom category input */}
                            {isOther && (
                                <div className="mt-3 flex gap-2">
                                    <input
                                        type="text"
                                        value={customCategory}
                                        onChange={(e) =>
                                            setCustomCategory(e.target.value)
                                        }
                                        className="input-field flex-1"
                                        placeholder="e.g., Train, Bus, Metro, Boat..."
                                        disabled={creatingCategory}
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCreateCategory}
                                        disabled={
                                            !customCategory.trim() ||
                                            creatingCategory
                                        }
                                        className="btn btn-primary px-4 flex-shrink-0"
                                    >
                                        {creatingCategory ? (
                                            <Spinner />
                                        ) : (
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 4.5v15m7.5-7.5h-15"
                                                />
                                            </svg>
                                        )}
                                        {creatingCategory
                                            ? "Creating..."
                                            : "Add"}
                                    </button>
                                </div>
                            )}

                            {/* Show selected category badge */}
                            {selectedCatName && !isOther && (
                                <p className="text-xs text-primary-600 dark:text-primary-400 mt-1.5 flex items-center gap-1">
                                    <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    {selectedCatName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="price" className="label">
                                Price (USD)
                            </label>
                            <input
                                id="price"
                                type="number"
                                value={price}
                                onBlur={onBlur}
                                onChange={(e) => setPrice(e.target.value)}
                                className="input-field"
                                placeholder="99.99"
                                step="0.01"
                                min="0"
                                required
                                disabled={isLoading}
                            />
                            <p className="text-xs text-slate-400 mt-1.5">
                                Price in cents will be stored internally
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={
                                    isLoading ||
                                    creatingCategory ||
                                    (isOther && !!customCategory.trim())
                                }
                                className="flex-1 btn btn-primary"
                            >
                                {isLoading ? <Spinner /> : null}
                                {isLoading ? "Creating..." : "Create Ticket"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 btn btn-outline cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
