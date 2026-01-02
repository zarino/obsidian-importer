/**
 * Escapes a string value for use in YAML frontmatter.
 * Handles special characters like colons, quotes, newlines, etc.
 *
 * @param value - The string value to escape
 * @returns YAML-safe string representation
 */
export function escapeYamlValue(value: string | undefined): string {
	if (!value) {
		return '';
	}

	const trimmed = value.trim();

	// YAML doesn't allow newlines in simple quoted strings - they must use literal or folded block style
	// For frontmatter, it's better to keep values on a single line
	if (/[\r\n]/.test(trimmed)) {
		// Replace newlines with spaces for frontmatter values
		// This is appropriate for titles, URLs, etc. that shouldn't have newlines anyway
		const singleLine = trimmed.replace(/\s*[\r\n]+\s*/g, ' ');
		return escapeYamlValue(singleLine); // Recursively escape the cleaned value
	}

	// Check if value needs quoting for YAML
	// Quote if: starts with special chars, contains : followed by space, or contains other YAML indicators
	const needsQuoting =
		/^[-?:,\[\]{}#&*!|>'"%@`]/.test(trimmed) || // Starts with YAML special char
		/:\s/.test(trimmed) || // Contains colon followed by space (key-value indicator)
		/^(true|false|null|yes|no|on|off)$/i.test(trimmed); // YAML boolean/null values

	if (needsQuoting) {
		// Use double quotes and escape only what's necessary for YAML double-quoted strings
		// In YAML double quotes, we need to escape: " and \
		return '"' + trimmed.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
	}

	return trimmed;
}
