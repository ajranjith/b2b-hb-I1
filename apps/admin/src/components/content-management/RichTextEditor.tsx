"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

type Props = {
  value?: string;
  onChange?: (html: string) => void;
};

export default function RichTextEditor({ value = "", onChange }: Props) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      config={{
        licenseKey: "GPL",  
      }}
      onChange={(_, editor) => {
        const data = editor.getData();
        onChange?.(data);
      }}
    />
  );
}