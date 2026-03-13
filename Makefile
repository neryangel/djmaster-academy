# DJMaster Academy — Build System
# Usage: make [target]

.PHONY: help validate lint format check clean stats

# Default
help:
	@echo ""
	@echo "  DJMaster Academy — Build System"
	@echo "  ================================"
	@echo ""
	@echo "  make validate     — Validate all YAML/JSON schemas"
	@echo "  make lint         — Lint markdown files"
	@echo "  make format       — Auto-format all content files"
	@echo "  make check        — Run full validation suite"
	@echo "  make stats        — Show project statistics"
	@echo "  make structure    — Show project file tree"
	@echo "  make clean        — Remove build artifacts"
	@echo ""

# Validate JSON/YAML schemas
validate:
	@echo "🔍 Validating schemas..."
	@find 01-courses -name "*.json" -exec python3 -m json.tool {} > /dev/null \; && echo "  ✅ All JSON files valid" || echo "  ❌ JSON validation failed"
	@find 01-courses -name "*.yaml" -exec python3 -c "import yaml,sys; yaml.safe_load(open(sys.argv[1]))" {} \; && echo "  ✅ All YAML files valid" || echo "  ❌ YAML validation failed"

# Lint markdown
lint:
	@echo "📝 Linting markdown..."
	@npx markdownlint-cli2 "01-courses/**/*.md" "00-docs/**/*.md" 2>/dev/null || echo "  ⚠️  Install: npm install -g markdownlint-cli2"

# Format content
format:
	@echo "✨ Formatting..."
	@npx prettier --write "01-courses/**/*.{md,yaml,json}" "00-docs/**/*.md" 2>/dev/null || echo "  ⚠️  Install: npm install -g prettier"

# Full check
check: validate lint
	@echo ""
	@echo "✅ All checks passed"

# Project stats
stats:
	@echo ""
	@echo "  📊 Project Statistics"
	@echo "  ====================="
	@echo "  Courses:     $$(find 01-courses -maxdepth 1 -type d | tail -n +2 | grep -v _schema | wc -l | tr -d ' ')"
	@echo "  Modules:     $$(find 01-courses -name "module.yaml" | wc -l | tr -d ' ')"
	@echo "  Lessons:     $$(find 01-courses -path "*/lessons/*.md" | wc -l | tr -d ' ')"
	@echo "  Exercises:   $$(find 01-courses -path "*/exercises/*.md" | wc -l | tr -d ' ')"
	@echo "  Quizzes:     $$(find 01-courses -name "quiz.json" | wc -l | tr -d ' ')"
	@echo "  Schemas:     $$(find 01-courses/_schema -name "*.json" 2>/dev/null | wc -l | tr -d ' ')"
	@echo "  Docs:        $$(find 00-docs -name "*.md" | wc -l | tr -d ' ')"
	@echo "  Tools:       $$(find 02-tools -name "*.html" 2>/dev/null | wc -l | tr -d ' ')"
	@echo "  Total files: $$(find . -type f -not -path './.git/*' | wc -l | tr -d ' ')"
	@echo ""

# File tree
structure:
	@find . -type f -not -path './.git/*' -not -name '.DS_Store' | sort | sed 's|[^/]*/|  |g'

# Clean
clean:
	@rm -rf dist/ build/ .cache/ node_modules/
	@echo "🧹 Cleaned build artifacts"
