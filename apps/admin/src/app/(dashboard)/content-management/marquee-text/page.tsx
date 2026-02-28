"use client";

import { useEffect, useState } from "react";
import { Input, Button, Card, message, Spin, Switch } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import {
  useListMarquee,
  useCreateMarquee,
  useUpdateMarquee,
} from "@/services/cms";

export default function MarqueeTextPage() {
  const { data, isLoading } = useListMarquee({ page: 1, limit: 1 });
  const createMutation = useCreateMarquee();
  const updateMutation = useUpdateMarquee();

  const marquee = data?.data?.[0] ?? null;

  const handleSave = (text: string, status: boolean) => {
    if (marquee) {
      updateMutation.mutate(
        { id: marquee.id, body: { text, status } },
        {
          onSuccess: () => message.success("Marquee updated successfully"),
          onError: () => message.error("Failed to update marquee"),
        }
      );
    } else {
      createMutation.mutate(
        { text, status },
        {
          onSuccess: () => message.success("Marquee saved successfully"),
          onError: () => message.error("Failed to save marquee"),
        }
      );
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex flex-col gap-6 h-full min-h-[calc(100vh-150px)]">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Marquee Text</h1>
        <p className="text-gray-500 mt-1">
          Manage the scrolling text displayed on the main portal for
          announcements and updates.
        </p>
      </div>

      <Card className="max-w-2xl">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spin />
          </div>
        ) : (
          <MarqueeForm
            marquee={marquee}
            onSave={handleSave}
            loading={isSaving}
          />
        )}
      </Card>
    </div>
  );
}

function MarqueeForm({
  marquee,
  onSave,
  loading,
}: {
  marquee: { text: string; status: boolean } | null;
  onSave: (text: string, status: boolean) => void;
  loading: boolean;
}) {
  const [form, setForm] = useMarqueeFormState(marquee);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Marquee Text
        </label>
        <Input.TextArea
          value={form.text}
          onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
          placeholder="Enter the marquee text to display on the dealer portal"
          rows={3}
          className="rounded-lg"
          maxLength={500}
          showCount
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={form.status}
            onChange={(checked) => setForm((prev) => ({ ...prev, status: checked }))}
          />
          <span className="text-sm text-gray-600">Active</span>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={() => onSave(form.text, form.status)}
          loading={loading}
          className="rounded-[33px] h-10"
        >
          Save
        </Button>
      </div>
    </div>
  );
}

function useMarqueeFormState(marquee: { text: string; status: boolean } | null) {
  const [form, setForm] = useState({
    text: marquee?.text ?? "",
    status: marquee?.status ?? true,
  });

  useEffect(() => {
    if (marquee) {
      setForm({ text: marquee.text, status: marquee.status });
    } else {
      setForm({ text: "", status: true });
    }
  }, [marquee?.text, marquee?.status, marquee]);

  return [form, setForm] as const;
}
