// Interface to describe with keys to derive from .json file.
// Each element must have at least id and title keys
export interface DropDownOption {
    label: string,
    value: number,
    [key: string]: any
}

/**
 * Normalize data from json
 * 
 * @param jsonData Raw json data
 * @param valueKey Key for selection-value in dropdown (defaults to "id")
 * @param labelKey Key for displayed value in dropdown (defaults to "title") 
 * @returns {DropdownOption[]} Array of normalized json data
 */
export function normalizeJsonData(jsonData: any[], valueKey: string = "id", labelKey: string = "title" ): DropDownOption[] {
    return jsonData.map((item) => ({
        value: item[valueKey],
        label: item[labelKey],
        ...item
    }))
}