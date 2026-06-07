/**
 * Input Validation Utilities
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.{8,}).*$/;

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Validate password strength
 * Requirements: 8+ characters, 1 uppercase, 1 lowercase, 1 number
 */
export function isValidPassword(password: string): boolean {
  return PASSWORD_REGEX.test(password);
}

/**
 * Validate name
 */
export function isValidName(name: string): boolean {
  return Boolean(name && name.trim().length >= 2 && name.trim().length <= 100);
}

/**
 * Validate title
 */
export function isValidTitle(title: string): boolean {
  return Boolean(
    title && title.trim().length >= 5 && title.trim().length <= 200,
  );
}

/**
 * Validate content
 */
export function isValidContent(content: string): boolean {
  return Boolean(
    content && content.trim().length >= 10 && content.trim().length <= 10000,
  );
}

/**
 * Validate tags array
 */
export function isValidTags(tags: string[]): boolean {
  if (!Array.isArray(tags) || tags.length === 0 || tags.length > 5) {
    return false;
  }
  return tags.every(
    (tag) =>
      typeof tag === 'string' &&
      tag.trim().length > 0 &&
      tag.trim().length <= 50,
  );
}

/**
 * Sanitize HTML/XSS prevention
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate registration input
 */
export function validateRegisterInput(data: {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.name || !isValidName(data.name)) {
    errors.push({
      field: 'name',
      message: 'Tên phải có từ 2 đến 100 ký tự',
    });
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Định dạng email không hợp lệ',
    });
  }

  if (!data.password || !isValidPassword(data.password)) {
    errors.push({
      field: 'password',
      message:
        'Mật khẩu phải có ít nhất 8 ký tự, bao gồm: chữ hoa, chữ thường, số',
    });
  }

  if (!data.role || !['sinhvien', 'giangvien', 'admin'].includes(data.role)) {
    errors.push({
      field: 'role',
      message: 'Vai trò không hợp lệ',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate login input
 */
export function validateLoginInput(data: {
  email?: string;
  password?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Vui lòng nhập email hợp lệ',
    });
  }

  if (!data.password || data.password.length < 1) {
    errors.push({
      field: 'password',
      message: 'Vui lòng nhập mật khẩu',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate create post input
 */
export function validateCreatePostInput(data: {
  title?: string;
  content?: string;
  tags?: string[];
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.title || !isValidTitle(data.title)) {
    errors.push({
      field: 'title',
      message: 'Tiêu đề phải có từ 5 đến 200 ký tự',
    });
  }

  if (!data.content || !isValidContent(data.content)) {
    errors.push({
      field: 'content',
      message: 'Nội dung phải có từ 10 đến 10000 ký tự',
    });
  }

  if (!isValidTags(data.tags || [])) {
    errors.push({
      field: 'tags',
      message: 'Vui lòng chọn từ 1 đến 5 tag',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate comment input
 */
export function validateCommentInput(data: {
  content?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (
    !data.content ||
    data.content.trim().length < 2 ||
    data.content.trim().length > 5000
  ) {
    errors.push({
      field: 'content',
      message: 'Bình luận phải có từ 2 đến 5000 ký tự',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
