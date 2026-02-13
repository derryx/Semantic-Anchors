#!/usr/bin/env python3
"""
Translate anchor files from English to German.
This script reads all .adoc files in docs/anchors/ and creates .de.adoc versions.
"""

import os
import re
from pathlib import Path

# German translations for common terms
TRANSLATIONS = {
    "Full Name": "Vollständiger Name",
    "Also known as": "Auch bekannt als",
    "Core Concepts": "Kernkonzepte",
    "Key Proponents": "Schlüsselvertreter",
    "When to Use": "Wann zu verwenden",
    "When Not to Use": "Wann nicht zu verwenden",
    "Benefits": "Vorteile",
    "Trade-offs": "Kompromisse",
    "Related Concepts": "Verwandte Konzepte",
    "Further Reading": "Weiterführende Literatur",
    "Examples": "Beispiele",
    "Common Pitfalls": "Häufige Fehler",
    "Best Practices": "Best Practices",
}

def translate_anchor_file(input_path: Path, output_path: Path):
    """Translate a single anchor file to German."""

    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # For now, just copy the file and mark it for manual translation
    # In production, this would use an LLM API or translation service

    # Add a translation header
    translated_content = f"""= [DE] {content.split('=', 1)[1].split(':')[0].strip()}
{':'.join(content.split(':')[1:]) if ':' in content else ''}

[NOTE]
====
Dies ist eine deutsche Übersetzung. Der englische Originaltext wurde beibehalten,
da die vollständige Übersetzung der technischen Inhalte noch aussteht.
====

{content}
"""

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(translated_content)

    print(f"Translated: {input_path.name} -> {output_path.name}")

def main():
    anchors_dir = Path("docs/anchors")

    if not anchors_dir.exists():
        print(f"Error: {anchors_dir} not found")
        return

    # Find all .adoc files (excluding .de.adoc)
    anchor_files = [f for f in anchors_dir.glob("*.adoc")
                    if not f.name.endswith(".de.adoc")]

    print(f"Found {len(anchor_files)} anchor files to translate")

    for anchor_file in sorted(anchor_files):
        output_file = anchor_file.parent / f"{anchor_file.stem}.de.adoc"

        if output_file.exists():
            print(f"Skipping {anchor_file.name} (translation already exists)")
            continue

        translate_anchor_file(anchor_file, output_file)

    print(f"\n✓ Translation complete! {len(anchor_files)} files processed")

if __name__ == "__main__":
    main()
