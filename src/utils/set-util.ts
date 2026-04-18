export default class SetUtil {
  /**
   * Returns all the elements of set1 that aren't in set2
   * @param set1
   * @param set2
   */
  public static subtract(set1: string[], set2: string[]): string[] {
    const map = new Map<string, boolean>();
    for (const e of set1) {
      map.set(e, true);
    }
    for (const e of set2) {
      if (map.has(e)) {
        map.set(e, false);
      }
    }
    return Array.from(map.entries())
      .filter((e: [string, boolean]) => e[1])
      .map((e: [string, boolean]) => e[0]);
  }
}
