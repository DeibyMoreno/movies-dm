import type { PaginationParams } from '../../lib/helpers/pagination.js';

import { ReviewMapper, type ReviewDTO } from './review.mapper.js';
import type { CreateReviewData, UpdateReviewData } from './review.model.js';
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

  async findAll(pagination: PaginationParams): Promise<ReviewDTO[]> {
    const result = await this.reviewRepository.findAll(pagination);
    return result.map(ReviewMapper.toDTO);
  }

  async create(data: CreateReviewData): Promise<ReviewDTO> {
    const review = await this.reviewRepository.create(data);
    return ReviewMapper.toDTO(review);
  }

  async update(id: string, data: UpdateReviewData): Promise<ReviewDTO | null> {
    const review = await this.reviewRepository.update(id, data);
    return review ? ReviewMapper.toDTO(review) : null;
  }

  async delete(id: string): Promise<boolean> {
    return this.reviewRepository.delete(id);
  }
}
