import { z } from 'zod';

export class EnvironmentManager {
  get(key: string): string | undefined {
    return process.env[key];
  }

  set(key: string, val: string): void {
    process.env[key] = val;
  }

  list(): Record<string, string | undefined> {
    return { ...process.env };
  }

  validate(requiredKeys: string[]): { success: boolean; errors?: string[] } {
    const schemaShape: Record<string, z.ZodString> = {};
    for (const key of requiredKeys) {
      schemaShape[key] = z.string({ required_error: `${key} is required` });
    }
    const schema = z.object(schemaShape);
    const result = schema.safeParse(process.env);
    
    if (!result.success) {
      return {
        success: false,
        errors: result.error.errors.map(err => err.message)
      };
    }
    return { success: true };
  }
}
