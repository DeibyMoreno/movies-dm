import type { PaginationParams } from '../../lib/helpers/pagination.js';

import { ReviewMapper, type ReviewDTO } from './review.mapper.js';
import type { ReviewRepository } from './review.repository.js';

export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async findByMovieId(movieId: string, pagination: PaginationParams): Promise<ReviewDTO[]> {
    const reviews = await this.reviewRepository.findByMovieId(movieId, pagination);
    return reviews.map(ReviewMapper.toDTO);
  }

  async findBySerieId(serieId: string, pagination: PaginationParams): Promise<ReviewDTO[]> {
    const reviews = await this.reviewRepository.findBySerieId(serieId, pagination);
    return reviews.map(ReviewMapper.toDTO);
  }

  async findById(id: string): Promise<ReviewDTO | null> {
    const review = await this.reviewRepository.findById(id);
    return review ? ReviewMapper.toDTO(review) : null;
  }
}
