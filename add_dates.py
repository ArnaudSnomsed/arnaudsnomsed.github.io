import os
import re

POSTS_DIR = "_posts"
FILENAME_RE = re.compile(r"^(\d{4}-\d{2}-\d{2})-.*\.(md|markdown)$", re.IGNORECASE)

for filename in sorted(os.listdir(POSTS_DIR)):
    match = FILENAME_RE.match(filename)
    if not match:
        continue

    date_str = match.group(1)
    filepath = os.path.join(POSTS_DIR, filename)

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Vérifie si le fichier commence bien par un frontmatter YAML (---)
    if not content.startswith("---"):
        print(f"[IGNORÉ - pas de frontmatter] {filename}")
        continue

    parts = content.split("---", 2)
    if len(parts) < 3:
        print(f"[IGNORÉ - frontmatter mal formé] {filename}")
        continue

    _, frontmatter, body = parts

    # Vérifie si une clé 'date:' existe déjà dans le frontmatter
    if re.search(r"^date\s*:", frontmatter, re.MULTILINE):
        print(f"[OK - date déjà présente] {filename}")
        continue

    # Ajoute la date à la fin du frontmatter
    new_frontmatter = frontmatter.rstrip() + f"\ndate: {date_str} 12:00:00 +0100\n"
    new_content = f"---{new_frontmatter}---{body}"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"[AJOUTÉ - {date_str}] {filename}")
